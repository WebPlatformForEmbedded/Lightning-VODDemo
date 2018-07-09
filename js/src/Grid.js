class Grid extends wuf.Component {
    static _template() {
        return {
            List:{

            }
        }
    }

    set items(v) {
        this.patch({
            List:{
                children: v.map((item, idx) => {
                    let x = idx % 5 * 290
                    let y = Math.floor(idx/5)*490

                    return {type: GridItem, data: item, x, y}
                })
            }
        })
    }

    get _items(){
        return this.tag('List').childList
    }

    _select(index){
        this.fire('select',{index})
    }


    static _states() {
        return {
            _init: function () {
                this._selectedIndex = 0
            },
            _handleLeft: function () {
                if (this._selectedIndex > 0) {
                    this._select(this._selectedIndex - 1)
                }
            },
            _handleRight: function () {
                if (this._selectedIndex < this._items.length - 1) {
                    this._select(this._selectedIndex + 1)
                }
            },
            _handleUp: function () {
                let index = this._selectedIndex - 5

                if (index >= 0) {
                    this._select(index);
                } else {
                    this.signal('back', {}, true)
                }
            },
            _handleDown: function () {
                let index = this._selectedIndex + 5

                if (index <= this._items.length - 1) {
                    this._select(index)
                }
            },
            _handleEnter: function () {
                this.signal('selectItem', {target: this._items.getAt(this._selectedIndex).data})
            },
            select: function ({index}) {
                this._selectedIndex = index % this._items.length

                this.patch({
                    List: {
                        smooth: {
                            y: -(Math.floor(this._selectedIndex / 5) * 490)
                        }
                    }
                })
            }
        }
    }

    _getFocused(){
        return this._items.getAt(this._selectedIndex)
    }

}

class GridItem extends wuf.Component{
    static _template() {
        return {
            scale: 0.9,
            Image: {},
            w: 260,
            h: 380,
            Label: {
                y: 400,
                x: 130,
                mountX: 0.5,
                alpha: 0.4,
                text: {fontSize: 30, wordWrapWidth: 260, textAlign: 'center', maxLines: 2, lineHeight: 40, fontFace: 'RobotoRegular'}
            }
        }
    }

    static _states(){
        return {
            _focus: function () {
                this.patch({
                    smooth: {scale: 1},
                    Label: {smooth: {alpha: 1}}
                })
            },
            _unfocus: function () {
                this.patch({
                    smooth: {scale: 0.9},
                    Label: {smooth: {alpha: 0.4}}
                })
            }
        }
    }

    set data(v){
        this._data = v

        this.patch({
            Image:{
                src:VodMain.getCropped({url:v.poster_path,w:260, h:390, path:'w300'})
            },
            Label:{
                text:{text:v.original_title}
            }
        })
    }

    get data(){
        return this._data
    }
}