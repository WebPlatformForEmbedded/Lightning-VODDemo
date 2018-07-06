class VodMain extends wuf.Application {

    static _template() {
        return {
            Background: {type: EpicBackground},
            Loader: {rect: true, w: 50, h: 50, x: 960, y: 540, pivot: 0.5, alpha: 0}
        }
    }

    static _states() {
        return {
            _init: function() {
                this._loadingAnimation = this.tag("Loader").animation({duration: 1, repeat: -1, actions: [
                    {p: 'rotation', v: {sm: 0, 0: 0, 1: 2 * Math.PI}}
                ]})

                setTimeout(() => {
                    const categories = [
                        {name: "Popular"},
                        {name: "Drama"},
                        {name: "Action"},
                        {name: "Sci-Fi"}
                    ]
                    this.fire('loaded', {categories})
                }, 2000)
                return "Loading"
            },
            Loading: {
                _enter: function() {
                    this.tag("Loader").setSmooth('alpha', 1)
                    this._loadingAnimation.start()
                },
                _exit: function() {
                    this.tag("Loader").setSmooth('alpha', 0)
                    this._loadingAnimation.stop()
                },
                loaded: "Loaded"
            },
            Loaded: {

            }
        }
    }

}

