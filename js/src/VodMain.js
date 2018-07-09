class VodMain extends wuf.Application {

    static _template() {
        return {
            Background: { type: EpicBackground  },
            Content: {
                Menu: {type: VodMenu, x: 261, y: 60, alpha: 0, signals: {itemSelected: "menuItemSelected"}},
                Categories: {x: 250, y: 100, type: VodCategories, alpha: 0, signals: {showMovie: true, back:true}},
            },
            Loader: {w:150, h:150, scale: 0.5, pivot: 0.5, mount:0.5, x:960, y:540, alpha: 0, src:'images/vod-loader.png'},
            Details: {type: VodDetails, alpha: 0}
        }
    }

    static _states() {
        return {
            _init: function() {
                this._api = new VodApi()

                this._loadingAnimation = this.tag("Loader").animation({duration: 1.5, repeat: -1, actions: [
                    {p: 'rotation', v: {sm: 0, 0: 0, 1: 2 * Math.PI}},
                    {p: 'scale', v: {0: 0.3, 0.5: 0.6, 1:0.3}},
                    {p: 'alpha', v: {0: 0, 0.5: 1, 1:0}},
                ]})

                this._api.getMovies().then(({items})=>{
                    const categories = items.map((cat)=>{
                        return {title:cat.title, items: cat.results, id: cat.id }
                    })

                    this.fire('loaded', {categories})
                }).catch((err)=>{
                    console.error( err )
                })
                return "Loading"
            },
            Loading: {
                _enter: function() {
                    this.tag("Loader").visible = true
                    this._loadingAnimation.start()
                },
                _exit: function() {
                    this.tag("Loader").visible = false
                    this._loadingAnimation.stop()
                },

                loaded: function({categories}) {
                    // Delegate.
                    this.tag("Categories").categories = categories

                    // Create and add menu items for every category.
                    const vodMenuItems = categories.map(cat => ({title: cat.title, categoryId: cat.id}))

                    this.tag("Menu").items = vodMenuItems
                    this.tag("Menu").setSmooth('alpha', 1)

                    return "Loaded.Content.Menu"
                }
            },
            Loaded: {
                _enter: function() {
                    this.tag("Menu").setSmooth('alpha', 1)
                    this.tag("Categories").setSmooth('alpha', 1)
                },
                Content: {
                    _enter: function() {
                        this.tag("Content").setSmooth('alpha', 1)
                    },
                    _exit: function() {
                        this.tag("Content").setSmooth('alpha', 0)
                    },
                    Menu: {
                        _handleDown: "Loaded.Content.Categories"
                    },
                    Categories: {
                        _handleUp: "Loaded.Content.Menu"
                    }
                },
                Details: {
                    _enter: function() {
                        this.tag('Details').setSmooth('alpha', 1)
                    },
                    _exit: function() {
                        this.tag('Details').setSmooth('alpha', 0)
                    },
                    _handleBack: function(){
                        return "Loaded.Content.Categories"
                    }
                },
                showMovie: function({item}) {
                    this.tag("Details").item = item
                    return "Loaded.Details"
                },
                back: function(){
                    return "Loaded.Content.Menu"
                }
            },
            menuItemSelected: function({item}) {
                this.tag("Categories").setActiveCategory(item.categoryId)
            }
        }
    }

    _getFocused() {
        // Delegate focus (for key handling) based on state.
        switch(this.state) {
            case "Loaded.Content.Menu":
                return this.tag("Menu")
                break
            case "Loaded.Content.Categories":
                return this.tag("Categories")
                break
            case "Loaded.Details":
                return this.tag("Details")
                break
        }
    }

    static getCropped({url,w,h,path}){
        return `//cdn.metrological.com/image?operator=metrological&url=${encodeURIComponent(`https://image.tmdb.org/t/p/${path}/${url}`)}&width=${w}&height=${h}&type=crop`
    }
}

