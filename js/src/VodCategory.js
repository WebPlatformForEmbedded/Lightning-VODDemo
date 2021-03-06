class VodCategory extends wuf.Component {

    static _template() {
        return {
            Grid: {
                type: Grid, x: 0, y: 200, w: 1620, h: 780, clipping: true, boundsMargin: [100,300,100,600] /* todo: explain! */, signals: {selectItem: true}
            }
        }
    }

    set category(obj) {
        this._category = obj
    }

    get category() {
        return this._category
    }

    _initialize() {
        const {title, items} = this._category

        this.patch({
            Grid: {items}
        })
    }

    static _states() {
        return {
            _active: function() {
                // We lazily wait for initialization until this vod category becomes active (= visible and within bounds).
                this._initialize()
            },
            selectItem: function({target}) {
                // Pass upwards.
                this.signal("selectItem", {item: target}, true)
            }
        }
    }

    _getFocused() {
        return this.tag("Grid")
    }

}