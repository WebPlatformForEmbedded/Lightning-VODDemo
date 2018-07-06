class VodCategory extends wuf.Component {

    static _template() {
        return {
            Title: {text: {fontSize: 40}, y: 130, x: 150},
            Grid: {type: Grid, x: 150, y: 200, w: 1620, h: 780, clipping: true, signal: {selectItem: true}}
        }
    }

    set category(obj) {
        this._category = obj
    }

    get category() {
        return this._category
    }

    _initialize() {
        const info = this._category

        const gridItems = info
        this.patch({
            Title: {text: {text: info.title}},
            Grid: {items: gridItems}
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
                this.signal("selectItem", {item: target})
            }
        }
    }

    _getFocused() {
        return this.tag("Grid")
    }

}