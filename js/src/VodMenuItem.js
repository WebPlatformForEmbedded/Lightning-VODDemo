class VodMenuItem extends wuf.Component {

    static _template() {
        return {
            Title: {color: 0xFFAAAAAA, text: {fontSize: 40}}
        }
    }

    getWidth() {
        // Ensure that the texture is loaded, which causes the width to be determined.
        this.tag("Title").texture.load()

        return this.tag("Title").renderWidth
    }

    set info(v) {
        this._info = v
        this.tag("Title").text.text = v.title
    }

    select() {
        this.fire('select')
    }

    deselect() {
        this.fire('deselect')
    }

    static _states() {
        return {
            _init: "Unfocused.Deselected",
            Focused: {
                _enter: function() {
                    this.tag("Title").color = 0xFFFFFFFF
                },
                _unfocus: "Unfocused.Selected",
                deselect: "Unfocused.Deselected"
            },
            Unfocused: {
                Selected: {
                    _enter: function() {
                        this.tag("Title").color = 0xFFEEEEEE
                    },
                    _focus: "Focused",
                    deselect: "Unfocused.Selected"
                },
                Deselected: {
                    _enter: function() {
                        this.tag("Title").color = 0xFFAAAAAA
                    },
                    select: "Focused",
                    _focus: "Focused.Deselected"
                }
            }
        }
    }
}
