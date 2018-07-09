class AppStore extends wuf.EventEmitter {

    constructor(hash) {
        super()
        this.hash = hash;
        this._socketDomain = 'wss://ws.metrological.com?operator=metrological'

        this._appStoreData = []
        this._socket = null
        this._init()
    }



    get data() {
        return this._appStoreData
    }

    _notify() {
        this.emit('newAppStoreData', {data: this._appStoreData})
    }

    _handleSocketMessage(event) {
        var data = {}
        try {
            data = JSON.parse(event.data);
        }catch (e) {
            return;
        }

        if (data.e === 'd' && data.d && data.d.v) {
            this._loadAppDataByVersion({version: data.d.v})
                .then(this._formatAppStoreData.bind(this))
                .then(this._notify.bind(this))
                .catch(function(){
                    console.error('Realtime update failed')
                })
        }

    }


    _XHRget(url) {
        return new Promise((resolve, reject) => {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        try{
                            resolve(JSON.parse(this.responseText))
                        }catch(e){
                            reject(e)
                        }
                    } else {
                        reject('IncorrectStatusCode')
                    }

                }
            };
            xhttp.open("GET", url, true);
            xhttp.send();
        })

    }


    _init() {
        this._initAppStoreSocket()
        this._initAppStoreData()
            .then(this._notify.bind(this))
            .catch(function(e){
                console.error('failed loading apps', e)
            })
    }


    _initAppStoreSocket() {
        var self = this
        this._socket = new WebSocket(this._socketDomain)
        this._socket.onmessage = this._handleSocketMessage.bind(this)
        this._socket.onopen = () => {
            const k = 'admin|' + self.hash
            self._socket.send(JSON.stringify({"e":"j","k":k}))
        }
        this._socket.onclose = () => {
            self._socket.onmessage = null
            self.socket = null
        }
    }

    _initAppStoreData() {
        return this._getLatestStoreVersion()
            .then(this._loadAppDataByVersion.bind(this))
            .then(this._formatAppStoreData.bind(this))

    }

    _formatAppStoreData(data) {
        let {categories:c, metadata:m} = data

        return new Promise((resolve,reject) => {
            if (!data) reject()
            this._appStoreData = c.map((el)=>{

                let apps = el.apps.map((el)=>{
                    return {
                        identifier: el,
                        name: m[el].name
                    }
                })
                return{
                    name: el.name, apps: apps
                }
            })
            resolve()
        })
    }

    _loadAppDataByVersion(versionData) {
        return this._XHRget('//cdn.metrological.com/apps/' + this.hash + '?version=' + versionData.version)
    }

    _getLatestStoreVersion() {
        return this._XHRget('//widgets.metrological.com/latest-version/' + this.hash)
    }
}
// Force widgets.metrological.com to be called, to get access to image/proxy servers.
const appStore = new AppStore("3eda7f3701d2832a281c556c1bc71b93")

