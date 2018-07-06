class VodCategories extends wuf.Component {

    static _template() {
        return {
            Categories: {}
        }
    }

    setActiveCategory(categoryId) {
        // Event is fired when another menu item is selected.
        // Check which category is selected and show it.
        this.fire("showCategory", {categoryId})
    }

    _getVodCategory(categoryId) {
        return this._vodCategories.getByRef(`C-${categoryId}`)
    }

    set categories(categories) {
        // Create and add category pages.
        const vodCategories = categories.map(cat => ({type: VodCategory, category: cat, ref: `C-${cat.id}`, visible: false, signals: {selectItem: true}}))
        this._vodCategories.patch(vodCategories)
    }

    _getActiveVodCategory() {
        return this._getVodCategory(this._activeVodCategoryId)
    }

    static _states() {
        return {
            _init: function() {
                this._vodCategories = this.tag("Categories").childList
            },
            Category: {
                _enter: function({args}) {
                    // Which one?
                    this.tag("Categories").setSmooth('alpha', 1)

                    // Firing at this point will fire Category.showCategory.
                    this.fire('showCategory', {categoryId: args.categoryId})
                },
                _exit: function() {

                    this.tag("Categories").setSmooth('alpha', 0)
                },
                showCategory: function({categoryId}) {
                    // Hide the previously shown category.
                    if (this._activeVodCategoryId) {
                        this._getVodCategory(this._activeVodCategoryId).visible = false
                    }

                    this._activeVodCategoryId = categoryId

                    // Show new category.
                    this._getVodCategory(categoryId).visible = true
                },
                selectItem: function({item}) {
                    this.signal("showMovie", {item})
                }
            },
            showCategory({categoryId}) {
                return "Category"
            }
        }
    }

    _getFocused() {
        switch(this.state) {
            case "Category":
                return this._getActiveVodCategory()
                break
        }
    }
}

