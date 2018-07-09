class VodDetails extends wuf.Component {

    static _template() {
        return {
            Wrapper: {
                Background: {
                    w: 1920,
                    h: 1080,
                    amount: 0,
                    transitions: {amount: {duration: 2, delay: 1}},
                    type: wuf.views.FastBlurView,
                    content: {
                        Image: {w: 1920, h: 1080}
                    }
                },
                Poster: {
                    x: 300, y: 400, alpha: 0.0001
                },
                Title: {
                    x: 700, y: 300, alpha: 0, text: {fontSize: 50, fontFace: 'RobotoLight'}
                },
                Info: {
                    x: 700,
                    y: 450,
                    alpha: 0,
                    text: {fontSize: 30, fontFace: 'RobotoLight', wordWrapWidth: 600, lineHeight: 45, maxLines:9git stat}
                }
            }
        }
    }

    static _states() {
        return {
            _init: function () {
                this._drop = this.tag('Background')

                this._drop.tag('Image').on('txLoaded', () => {
                    this.fire('loaded')
                });

                this._drop.transition('amount').on('finish', () => {
                    this.fire('blurReady')
                });
            },
            _focus: "Loading",
            _unfocus: function () {
                return ""
            },
            Loading: {
                _enter: function () {
                    // @todo: loader
                },
                _exit: function () {
                    // @todo: hide loader
                },
                loaded: "Loaded"
            },
            Loaded: {
                _enter: function () {
                    this.patch({
                        Wrapper: {
                            Background: {smooth: {amount: 3}},
                            Poster: {
                                src: VodMain.getCropped({
                                    url: this._item.poster_path,
                                    w: 400,
                                    h: 550,
                                    path: 'w300'
                                })
                            }
                        }
                    })
                },
                blurReady: function () {
                    this.patch({
                        Wrapper: {
                            Poster: {smooth: {alpha: 1, y: 300}},
                            Title: {smooth: {alpha: 1, x: 800}},
                            Info: {smooth: {alpha: 1, x: 800}}
                        }
                    })
                },
                _exit: function () {
                    this.patch({
                        Wrapper: {
                            Background: {amount: 0},
                            Poster: {alpha: 0.0001, y: 400},
                            Title: {x: 700, alpha: 0},
                            Info: {x: 700, alpha: 0}
                        }
                    })
                }
            }
        };
    }

    set item(v) {
        this._item = v

        this._drop.tag('Image').src = VodMain.getCropped({url: v.backdrop_path, w: 1920, h: 1080, path: 'w1280'})

        this.patch({
            Wrapper: {
                Title: {text: {text: v.original_title}},
                Info: {text: {text: v.overview}}
            }
        })
    }

}