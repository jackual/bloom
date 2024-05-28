let particles = []

/*

need to sort out responsive design soon (?)

set up config object for animation
layer as class? w particles object
potentially be able to tween between animation configs
multiple animation classes in array , iterate through different animations when requesting animation frame

*/

onload = () => {
    const r = x => Math.random() * x

    let canvas = document.getElementById('canvas'); //pass these to Animation class ? want to be able to move out of onload
    let ctx = canvas.getContext('2d');

    class Particle {
        constructor(circle) {
            this.pos = circle.pos
            this.size = circle.size
            this.gradient = circle.gradient //rename to colour
            this.time = {
                lifespan: circle.lifespan || Infinity,
                birth: new Date(),
                get age() {
                    return new Date() - this.birth
                },
                get dead() {
                    return (new Date() - this.birth) > this.lifespan
                }
            }
            this.motion = circle.motion || "none"
            this.type = "soft"
        }

        update() {
            switch (this.motion) {
                case "shake":
                    this.pos = this.pos.map(i => i - r(5) + r(5))
                case "none":
                    break
            }
        }

        render() {


            /*

            gradient value as actual gradient
            might be useful
            no opacity function based on lifespan but could be added in somewhere else

            if (this.gradient.length) {
                Object.entries(this.gradient).forEach(i => {
                    gradient.addColorStop(Number(i[0]), i[1].hsla)
                })
            }
            else {
                gradient.addColorStop(0, this.gradient.hsla)
                gradient.addColorStop(1, this.gradient.opacity(-1).hsla)
            }

            */

            const calculateOpacity = (age, ls, div = 3, power = 1) => {
                const fn = (x, max, min = 0) => {
                    if (x > max || x < min) return false
                    const percent = (x - min) / (max - min)
                    return Math.max(min ? 1 - percent : percent, 0.00001)
                }
                const linear = fn(age, ls / div) || fn(age, ls, (ls / div) * (div - 1)) || 1
                return Math.pow(linear, power) - 1
            } //add start and end

            const opacity = calculateOpacity(this.time.age, this.time.lifespan, 3, 2)

            switch (this.type) { //fix this URGENT
                case "soft":
                    const gradient = ctx.createRadialGradient(
                        ...this.pos,
                        0,
                        ...this.pos,
                        this.size
                    )

                    gradient.addColorStop(0, this.gradient.opacity(opacity).hsla)
                    gradient.addColorStop(1, this.gradient.opacity(-1).hsla)
                    ctx.beginPath()
                    ctx.arc(...this.pos, this.size, 0, 2 * Math.PI)
                    ctx.closePath()
                    ctx.fillStyle = gradient
                    ctx.fill()
            }
        }
    }
    /*
    const colour = new Colour(r(360))
    new Array(1).fill().forEach((i, j) => {
        let col = colour.hueRotate(r(100)).lighten(r(20))
        if (j % 2) col = col.hueRotate(180)
        let circle = new Particle({
            pos: [r(400), r(400)],
            size: 200 + r(100),
            gradient: col
        })
        particles.push(circle)
    })
 
    */

    const animate = () => { //make animation class? Animation.step()
        // =================== move code to layer class refresh method
        particles.forEach((i, j) => {
            i.update()
            if (i.time.dead) delete particles[j]
        })

        particles = particles.filter(i => i)

        if (particles.length < 60) { //
            particles.push(new Particle({ //take input functions for each property, use these as default
                pos: [r(400), r(400)],
                size: r(100),
                gradient: new Colour(r(360)),
                lifespan: r(1e3) + 1e3
            }))
        }

        // ====================

        //refresh layers

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach(i => {
            i.render()
        }) // change to layers

        window.requestAnimationFrame(animate)
    }

    window.requestAnimationFrame(animate) //Animation.play()

    /*
    new Array(6).fill().forEach((i, j) => {
        render3d(
            40 + (j * 60),
            200,
            (j * 10) - 30,
            20,
            new Colour(j * 40)
        )
    })
    */

    //render3d()


    /*
 
    let colour = new Colour(10, 10)
    setInterval(() => {
        colour = colour.hueRotate(5)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        render({
            pos: [200, 200],
            size: 150,
            gradient: [colour.opacity(-1), colour]
        })
    }, 1e3)
 
    */

}

//inspo spiral gallery 