class VodMenu extends wuf.Component {

    static _template() {
        return {
            Wrapper: {alpha:0, y:-200, mountX: 0.5, x: 960, y: 100, texture: wuf.Tools.getRoundRect(1700,100,20, 0, 0x00000000, true, 0x33ffffff),
                Items:{y: 25, x:25}
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
                    smooth:{alpha:1, y:50}
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

