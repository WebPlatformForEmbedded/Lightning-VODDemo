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
                this.tag("Shader").animation({duration: 45, repeat: -1, actions: [
                    {p: 'shader.color1', v: {0: 0xFF0c5fad, 0.1: 0xFF0ed2f7, 0.4: 0xFF0f3443, 0.6: 0xFF70e1f5, 0.8: 0xFFf8b500, 1: 0xFF0c5fad}},
                    {p: 'shader.color2', v: {0: 0xFF96d7fd, 0.1: 0xFFB2FEFA, 0.4: 0xFF34e89e, 0.6: 0xFFffd194, 0.8: 0xFFfceabb, 1: 0xFF96d7fd}},
                    {p: 'shader.banding', v: {0.5: 0.0, 0.6: {s: 0, v: 0.95}, 0.90: {s: 0, v: 0.95}, 1: 0}}
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