class VodMenu extends wuf.Component {
    static _template() {
        return {
            Wrapper:{
                alpha:0, y:-200,
                mountX: 0.5, x: 960, y: 100,
                texture: wuf.Tools.getRoundRect(1700,100,20, 0, 0x00000000, true, 0x33ffffff),
                Items:{
                    y: 25, x:25
                }
            }
        }
    }

    set items(v){
        this._items = v

        this.tag('Items').patch({
            children:v.map((item)=>{
                return {type:MenuItem, label:item.name}
            })
        })

        let pos = 0

        this.tag('Items').children.forEach((item)=>{
            item.x = pos
            item.loadTexture()
            pos+=item.renderWidth + MenuItem.MARGIN
        })
    }

    static _states() {
        return {
            _active: function(){
                this.patch({
                    Wrapper:{
                        smooth:{alpha:1, y:50}
                    }
                })
            },
            _inactive: function(){

            }
        }
    }
}

class MenuItem extends wuf.Component{
    static _template(){
        return {
            text:'', fontSize:40
        }
    }
    set label(v){
        this.patch({
            text:{text:v}
        })
    }
}

MenuItem.MARGIN = 50

