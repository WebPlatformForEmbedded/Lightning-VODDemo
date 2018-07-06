class VodMain extends wuf.Application {

    static _template() {
        return {
            Background: { type: EpicBackground  },
            Menu: {type: VodMenu, x: 0, y: 0, alpha: 0, signals: {itemSelected: "menuItemSelected"}},
            Categories: {y: 100, type: VodCategories, alpha: 0, signals: {showMovie: true}},
            Loader: {w:150, h:150, scale: 0.5, pivot: 0.5, mount:0.5, x:960, y:540, alpha: 0, src:'images/vod-loader.png'},
            Details: {type: VodDetails, alpha: 0}
        }
    }

    static _states() {
        return {
            _init: function() {
                this._api = new VodApi()

                // @todo: implement
                this._api.getPopular().then((data)=>{
                    console.log(data.results)
                })

                // @todo: implement
                this._api.getGenre('action').then((data)=>{
                    console.log(data.results)
                })

                this._loadingAnimation = this.tag("Loader").animation({duration: 1.5, repeat: -1, actions: [
                    {p: 'rotation', v: {sm: 0, 0: 0, 1: 2 * Math.PI}},
                    {p: 'scale', v: {0: 0.3, 0.5: 0.6, 1:0.3}},
                    {p: 'alpha', v: {0: 0, 0.5: 1, 1:0}},
                ]})

                setTimeout(() => {
                    const categories = [
                        {title: "Popular", id: 1},
                        {title: "Drama", id: 2},
                        {title: "Action", id: 3},
                        {title: "Sci-Fi", id: 4}
                    ]
                    this.fire('loaded', {categories})
                }, 2000)

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

                    return "Loaded.Menu"
                }
            },
            Loaded: {
                _enter: function() {
                    this.tag("Menu").setSmooth('alpha', 1)
                    this.tag("Categories").setSmooth('alpha', 1)
                },
                Menu: {
                    _handleDown: "Loaded.Categories"
                },
                Categories: {
                    _handleUp: "Loaded.Menu"
                },
                Details: {
                    _enter: function() {
                        this.setSmooth('alpha', 1)
                    },
                    _exit: function() {
                        this.setSmooth('alpha', 0)
                    },
                    _handleBack: function() {
                        // Back to category overview.
                        return "Loaded.Categories"
                    }
                },
                showMovie: function({item}) {
                    this.tag("Details").item = item
                    return "Loaded.Categories.Details"
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
            case "Loaded.Menu":
                return this.tag("Menu")
                break
            case "Loaded.Categories":
                return this.tag("Categories")
                break
            case "Loaded.Details":
                return this.tag("Details")
                break
        }
    }
}

