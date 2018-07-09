class VodDetails extends wuf.Component {

    static _template() {
        return {
            Wrapper:{
                Background: {w: 1920, h: 1080, amount:0, transitions:{amount:{duration:2,delay:1}}, type: wuf.views.FastBlurView, content: {
                    Image: {w: 1920, h: 1080}
                }}
            }
        }
    }

    static _states() {
        return {
            _init: function(){
                this._drop = this.tag('Background')

                this._drop.tag('Image').on('txLoaded',()=>{
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
                    this.patch({
                        Wrapper:{
                            Background:{smooth:{amount:3}}
                        }
                    })
                },
                _exit: function(){
                    this.patch({
                        Wrapper:{
                            Background:{amount:0}
                        }
                    })
                }
            }
        }
    }

    set item(v){
        this._item = v
        this._drop.tag('Image').src = VodMain.getCropped({url:v.backdrop_path,w:1920, h:1080, path:'w1280'})
    }

}