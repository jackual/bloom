const r = x => Math.random() * x

class Particle {
    constructor(setup, ctx) {
        this.ctx = ctx
        this.pos = setup.pos
        this.size = setup.size
        this.colour = setup.colour
        this.time = {
            lifespan: setup.lifespan || Infinity,
            birth: new Date(),
            get age() {
                return new Date() - this.birth
            }
        }

        this.motion = setup.properties.motion
        this.type = setup.properties.type
        this.speedInit = setup.properties.speedInit()
        this.speedLive = setup.properties.speedLive
        this.speed = () => this.speedInit + this.speedLive()
        this.fade = setup.properties.fade

    }

    get isDead() {
        const xy = [this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight]
        const isOffScreen = (pos, size, canvasSize) =>
            pos.map((i, j) => i > 0 - (size / 2) && i < canvasSize[j] + (size / 2)).every(i => i)
        return !isOffScreen(this.pos, this.size, xy) || (new Date() - this.time.birth) > this.time.lifespan
    }

    update() {
        switch (this.motion) {
            case "shake":
                this.pos = this.pos.map(i => i - r(5) + r(5))
                break
            case "down":
                this.pos[1] = this.pos[1] + (2 * this.speed())
                break
            case "up":
                this.pos[1] = this.pos[1] - (2 * this.speed())
                break
            case "none":
                break
        }
    }

    render() {
        const calculateOpacity = (age, ls, div = 3, power = 1, noIn, noOut) => {
            const fn = (x, max, min = 0) => {
                if (x > max || x < min) return false
                const percent = (x - min) / (max - min)
                return Math.max(min ? 1 - percent : percent, 0.00001)
            }
            const linear = ((noIn && age < ls / div) ? 1 : fn(age, ls / div))
                || ((noOut && age > (ls / div) * (div - 1)) ? 1 : fn(age, ls, (ls / div)) * (div - 1))
                || 1
            return Math.pow(linear, power) - 1
        }

        const colour = this.colour.opacity(calculateOpacity(
            this.time.age,
            this.time.lifespan,
            this.fade.divisions,
            this.fade.power,
            this.fade.noFadeIn,
            this.fade.noFadeOut
        ))

        switch (this.type) {
            case "soft":
                const gradient = this.ctx.createRadialGradient(
                    ...this.pos,
                    0,
                    ...this.pos,
                    this.size
                )

                gradient.addColorStop(0, colour.hsla)
                gradient.addColorStop(1, colour.opacity(-1).hsla)

                this.ctx.beginPath()
                this.ctx.arc(...this.pos, this.size, 0, 2 * Math.PI)
                this.ctx.closePath()
                this.ctx.fillStyle = gradient
                this.ctx.fill()
                break
            case "hard":
                this.ctx.beginPath()
                this.ctx.arc(...this.pos, this.size, 0, 2 * Math.PI)
                this.ctx.closePath()
                this.ctx.fillStyle = colour.hsla
                this.ctx.fill()
                break
        }
    }
}

class Layer {
    constructor(setup, ctx) {
        this.ctx = ctx
        this.particles = []

        this.particleSetup = setup.particle
        this.pos = setup.pos
        this.size = setup.size
        this.colour = setup.colour
        this.lifespan = setup.lifespan
        this.count = setup.count
    }
    refresh() {
        this.particles.forEach((i, j) => {
            i.update()
            if (i.isDead) delete this.particles[j]
        })

        this.particles = this.particles.filter(i => i)

        if (this.particles.length < this.count) {
            this.particles.push(new Particle({
                pos: this.pos(),
                size: this.size(),
                colour: this.colour(),
                lifespan: this.lifespan(),
                properties: this.particleSetup
            }, this.ctx))
        }
    }
    render() {
        this.particles.forEach(i => {
            i.render()
        })
    }
}

class Animation {
    constructor(setup) {
        let canvas = document.getElementById('canvas')
        let ctx = canvas.getContext('2d')
        ctx.canvas.width = size[0]
        ctx.canvas.height = size[1]
        this.canvas = canvas
        this.ctx = ctx
        this.noise = setup.noise
        this.layers = setup.layers.map(i => new Layer(i, this.ctx))
        this.step = this.step.bind(this)
    }
    step() {
        this.layers.forEach(i => i.refresh())
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.layers.forEach(i => { i.render() })
        window.requestAnimationFrame(this.step)
    }
    play() {
        if (this.noise !== null)
            console.log(this.noise), document.getElementById("noiseStyle").innerHTML = `video {opacity: ${this.noise} !important}`
        window.requestAnimationFrame(this.step)
    }
} 