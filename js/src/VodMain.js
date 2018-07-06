class VodMain extends wuf.Application {

    static _template() {
        return {
            Background: { type: EpicBackground  },
            Loader: {
                 w:150, h:150, scale: 0.5, pivot: 0.5, mount:0.5, x:960, y:540, alpha: 0, src:'images/vod-loader.png'
            },
            Menu:{ type:VodMenu, visible: false }
        }
    }

    static _states() {
        return {
            _init: function() {
                this._loadingAnimation = this.tag("Loader").animation({duration: 1.5, repeat: -1, actions: [
                    {p: 'rotation', v: {sm: 0, 0: 0, 1: 2 * Math.PI}},
                    {p: 'scale', v: {0: 0.3, 0.5: 0.6, 1:0.3}},
                    {p: 'alpha', v: {0: 0, 0.5: 1, 1:0}},
                ]})
                setTimeout(() => {
                    const categories = [
                        {name: "Popular"},
                        {name: "Action"},
                        {name: "Adventure"},
                        {name: "Animation"},
                        {name: "Comedy"},
                    ]
                    this.fire('loaded', {categories})
                }, 2000)

                return "Loading"
            },
            Loading: {
                _enter: function() {
                    this.tag("Loader").setSmooth('alpha', 1)
                    this._loadingAnimation.start()
                },
                _exit: function() {
                    this.tag("Loader").setSmooth('alpha', 0)
                    this._loadingAnimation.stop()
                },
                loaded: "Loaded"
            },
            Loaded: {
                _enter: function({args:{categories}}){
                    this.tag('Menu').items = categories
                    this.tag('Menu').visible = true
                }
            }
        }
    }

}

