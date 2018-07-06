class VodMenu extends wuf.Component {

    static _template() {
        return {
            Wrapper: {alpha:0, y:-200, y: -500, h:200, w:1920, rect:true, color:0x80000000,
                Items:{y: 100, x:50}
            }
        }
    }

    set items(items) {
        this.tag("Items").childList.patch(items.map(item => ({type: VodMenuItem, info: item})))
        const menuItems = this.tag("Items").childList.get()

        // Layout items.
        let x = 0
        menuItems.forEach(menuItem => {
            menuItem.x = x
            x += menuItem.getWidth() + 50 /* margin */
        })

        // We use a 'fire' because it causes the focus path to be recalculated.
        this.select(0)
    }

    get _items() {
        return this.tag("Items").childList
    }

    select(index) {
        this.fire('select', {index})
    }

    static _states() {
        return {
            _init: function() {
                this._selectedIndex = 0
            },
            _active: function() {
                this.tag("Wrapper").patch({
                    smooth:{alpha:1, y:0}
                })
            },
            _handleRight: function() {
                if (this._selectedIndex < this._items.length - 1) {
                    this.select(this._selectedIndex + 1)
                }
            },
            _handleLeft: function() {
                if (this._selectedIndex > 0) {
                    this.select(this._selectedIndex - 1)
                }
            },
            select: function({index}) {
                this._items.getAt(this._selectedIndex).deselect()
                this._selectedIndex = index % this._items.length
                const newSelectedItem = this._items.getAt(this._selectedIndex)
                newSelectedItem.select()

                // Send a bubbling signal upwards.
                this.signal('itemSelected', {item: newSelectedItem._info})
            },
            _focus: function() {
                this.tag("Wrapper").setSmooth('alpha', 1.0)
            },
            _unfocus: function() {
                this.tag("Wrapper").setSmooth('alpha', 0.7)
            }
        }
    }

    _getFocused() {
        if (this._items.length) {
            return this._items.getAt(this._selectedIndex)
        } else {
            return this
        }
    }
}

