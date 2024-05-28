let animation, iac

const size = [window.innerWidth, window.innerHeight]

let live = {
    value: 0
}

const version = {
    web: () => {
        DiffCamEngine.init({
            captureIntervalTime: INTERVAL,
            captureCallback: i => {
                live.value = i.score
                audio.filter = i.score / 3 > 100 ? 100 : i.score / 3
            },
            initSuccessCallback: () => {
                DiffCamEngine.start()
            }
        })

        animation = new Animation({
            layers: [{
                particle: {
                    type: "soft",
                    motion: "down",
                    speedInit: () => .1,
                    speedLive: () => 0,
                    fade: {
                        divisions: 3,
                        power: 2
                    }
                },
                pos: () => size.map(i => r(i)),
                size: () => size[0] * 0.75,
                colour: () => new Colour(200 + r(200), 100, 50 + r(20)),
                lifespan: () => r(2e3) + 2e3,
                count: 16
            }, {
                particle: {
                    type: "soft",
                    motion: "down",
                    speedInit: () => r(1),
                    speedLive: () => Math.max(0, live.value / 60),
                    fade: {
                        divisions: 2,
                        power: 0.6,
                        noFadeIn: false
                    }
                },
                pos: () => [r(size[0]), 0],
                size: () => 60 + r(30) /*20 + r(10)*/,
                colour: () => new Colour(300 + r(100), 100, 70 + r(20)),
                lifespan: () => 1e4,
                count: 700
            }],
            id: "#canvas"
        })

        animation.play()
    },
    final: () => {
        WebMidi
            .enable()
            .then(() => {
                const output = WebMidi.getOutputByName("IAC Driver Bus 1")
                iac = output.channels[1]
                iac.sendPitchBend(0)
            })
            .then(() => {
                DiffCamEngine.init({
                    captureIntervalTime: 50,
                    captureCallback: i => {
                        live.value = i.score
                        iac.sendControlChange(12, i.score / 3 > 127 ? 127 : i.score / 3)
                    },
                    initSuccessCallback: () => {
                        DiffCamEngine.start()
                    }
                })
            })

        animation = new Animation({
            layers: [{
                particle: {
                    type: "soft",
                    motion: "down",
                    speedInit: () => .1,
                    speedLive: () => 0,
                    fade: {
                        divisions: 3,
                        power: 2
                    }
                },
                pos: () => size.map(i => r(i)),
                size: () => size[0] * 0.75,
                colour: () => new Colour(200 + r(200), 100, 50 + r(20)),
                lifespan: () => r(2e3) + 2e3,
                count: 16
            }, {
                particle: {
                    type: "soft",
                    motion: "down",
                    speedInit: () => r(1),
                    speedLive: () => Math.max(0, live.value / 60),
                    fade: {
                        divisions: 2,
                        power: 0.6,
                        noFadeIn: false
                    }
                },
                pos: () => [r(size[0]), 0],
                size: () => 60 + r(30) /*20 + r(10)*/,
                colour: () => new Colour(300 + r(100), 100, 70 + r(20)),
                lifespan: () => 1e4,
                count: 700
            }],
            id: "#canvas"
        })

        animation.play()
    },
    early: () => {
        DiffCamEngine.init({
            captureIntervalTime: 50,
            captureCallback: i => {
                live.value = i.score
            },
            initSuccessCallback: () => {
                DiffCamEngine.start()
            }
        })
        animation = new Animation({
            layers: [{
                particle: {
                    type: "soft",
                    motion: "down",
                    speedInit: () => .1,
                    speedLive: () => 0,
                    fade: {
                        divisions: 3,
                        power: 2
                    }
                },
                pos: () => size.map(i => r(i)),
                size: () => size[0] * 0.75,
                colour: () => new Colour(250 + r(60), 100, 50 + r(20)),
                lifespan: () => r(2e3) + 2e3,
                count: 16
            }, {
                particle: {
                    type: "soft",
                    motion: "up",
                    speedInit: () => r(1),
                    speedLive: () => Math.max(0, live.value / 20),
                    fade: {
                        divisions: 2,
                        power: 0.6,
                        noFadeIn: false
                    }
                },
                pos: () => [r(size[0]), size[1]],
                size: () => 10 + r(10),
                colour: () => new Colour(0, 100, 100),
                lifespan: () => 1e4,
                count: 200
            }],
            id: "#canvas"
        })

        animation.play()
    },
    soft: () => {
        animation = new Animation({
            layers: [{
                particle: {
                    type: "soft",
                    motion: "shake",
                    speedInit: () => 0,
                    speedLive: () => 0,
                    fade: {
                        divisions: 3,
                        power: 2
                    }
                },
                pos: () => size.map(i => r(i)),
                size: () => size[0] * 0.75,
                colour: () => new Colour(r(360), 100, 50),
                lifespan: () => r(2e3) + 2e3,
                count: 16
            }],
            noise: 0.3,
            id: "#canvas"
        })

        animation.play()
    },
    shake: () => {
        animation = new Animation({
            layers: [{
                particle: {
                    type: "soft",
                    motion: "shake",
                    speedInit: () => 0,
                    speedLive: () => 0,
                    fade: {
                        divisions: 3,
                        power: 2
                    }
                },
                pos: () => size.map(i => r(i)),
                size: () => r(100),
                colour: () => new Colour(r(360), 100, 50),
                lifespan: () => r(3e3),
                count: 50
            }],
            noise: 0,
            id: "#canvas"
        })

        animation.play()
    },
    nano: () => {
        animation = new Animation({
            layers: [{
                particle: {
                    type: "hard",
                    motion: "none",
                    speedInit: () => 0,
                    speedLive: () => 0,
                    fade: {
                        divisions: 3,
                        power: 2,
                        noFadeIn: true,
                        noFadeOut: true
                    }
                },
                pos: () => size.map(i => r(i)),
                size: () => r(20),
                colour: () => new Colour(Math.floor(new Date() / 25) % 360, 100, 50),
                lifespan: () => 1e3,
                count: 600
            }],
            noise: 0,
            id: "#canvas"
        })

        animation.play()
    }
}

const startVisual = () => {
    const param = new URL(window.location.href).searchParams.get("mode")
    version[param] ? version[param]() : version.web()
}