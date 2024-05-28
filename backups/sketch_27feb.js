onload = () => {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    const render = circle => {
        const gradient = ctx.createRadialGradient(...circle.pos, 0, ...circle.pos, circle.size);
        //gradient.addColorStop(0, circle.gradient[0].hsla);
        //gradient.addColorStop(1, circle.gradient[1].hsla);

        Object.entries(circle.gradient).forEach(i => {
            gradient.addColorStop(Number(i[0]), i[1].hsla)
        })
        //multiple points

        ctx.beginPath()
        ctx.arc(...circle.pos, circle.size, 0, 2 * Math.PI);
        ctx.closePath()

        ctx.fillStyle = gradient;
        ctx.fill();
    }

    const render3d = (x, y, z, size, colour = new Colour()) => { //change args later
        console.log(x, y, z, size, colour)
        render({
            pos: [x, y],
            size: (size + (z / 5)),
            gradient: {
                0: colour.opacity(z / 100),
                1: colour.opacity(-1)
            }
        })
    }
    const r = x => Math.random() * x,
        colour = new Colour(r(360))
    new Array(20).fill().forEach((i, j) => {
        let col = colour.hueRotate(r(100)).lighten(r(20))
        if (j % 2) col = col.hueRotate(180)
        console.log(colour)
        render({
            pos: [r(400), r(400)],
            size: 200 + r(100),
            gradient: [col, col.opacity(-1)]
        })
    })

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