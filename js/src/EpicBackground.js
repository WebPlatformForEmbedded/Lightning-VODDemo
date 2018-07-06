class EpicBackground extends wuf.Component {

    static _template() {
        return {
            Shader: {color: 0xFF888888, shader: {type: FlowingGradientShader, graining: 0.01}, texture: {type: wuf.textures.NoiseTexture}, w: 1920, h: 1080}
        }
    }

    _step(dt) {
        const shader = this.tag("Shader").shader

        this._t += dt
        shader.setPos1(Math.cos(-0.42 * this._t), Math.sin(0.5 * this._t))
        shader.setPos2(0.7 * Math.cos(0.7 * this._t), 0.7*Math.sin(-0.32*this._t))
    }

    static _states() {
        return {
            _construct: function() {
                this._t = 0

                this._frameStartListener = () => {
                    this._step(this.stage.dt * 0.25)
                }
            },
            _init: function() {
                this.tag("Shader").animation({duration: 60, repeat: -1, actions: [
                    {p: 'shader.color1', v: {0: 0xFFFF0000, 0.1: 0xFFFFFF00, 0.4: 0xFF00FF00, 0.6: 0xFFFF0000, 0.8: 0xFF0000FF, 1: 0xFFFF0000}},
                    {p: 'shader.color2', v: {0: 0xFF0000FF, 0.1: 0xFFFF00FF, 0.4: 0xFF0000FF, 0.6: 0xFF0000FF, 0.8: 0xFFFF0000, 1: 0xFF0000FF}},
                    {p: 'shader.banding', v: {sm: 0, 0.4: 0, 0.5: 0.80, 0.6: 0.95, 0.8: 0.95, 0.95: 0.95, 1: 0}}
                ]}).start()
            },
            _enable: function() {
                this.stage.on('frameStart', this._frameStartListener)
            },
            _disable: function() {
                this.stage.on('frameEnd', this._frameStartListener)
            }
        }
    }


}