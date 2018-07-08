class VodDetails extends wuf.Component {

    static _template() {
        return {
            Wrapper:{
                Background:{

                }
            }
        }
    }

    static _states() {
        return {
            _init: function(){
                this.tag('Background').on('txLoaded',()=>{
                    this.fire('loaded')
                })
            },
            _focus: "Loading",
            _unfocus: function(){
                return ""
            },
            Loading:{
                _enter: function(){
                    // @todo: loader
                },
                _exit: function(){
                    // @todo: hide loader
                },
                loaded: "Loaded"
            },
            Loaded:{
                _enter: function(){
                }
            }
        }
    }

    set item(v){
        this._item = v

        this.patch({
            Wrapper:{
                Background:{
                    src:VodMain.getCropped({url:v.backdrop_path,w:1920, h:1080, path:'w1280'})
                }
            }
        })
        
    }

}