class Colour {
    constructor(
        hue = 0,
        saturation = 100,
        lightness = 50,
        alpha = 1
        //update = null
    ) {
        this.hue = hue
        this.saturation = saturation
        this.lightness = lightness
        this.alpha = alpha
    }

    #bounds(value, max, min = 0) {
        if (value < min)
            return min
        if (value > max)
            return max
        return value
    }

    #hue = null

    get hue() {
        return this.#hue
    }

    set hue(value) {
        if (value > 720 || value < -360)
            throw new Error("Hue value invalid")
        if (value > 360)
            this.#hue = value - 360
        if (value < 0)
            this.#hue = value + 360
        if (this.#hue === null)
            this.#hue = value
    }

    #saturation

    get saturation() {
        return this.#saturation
    }

    set saturation(value) {
        this.#saturation = this.#bounds(value, 100)
    }

    #lightness

    get lightness() {
        return this.#lightness
    }

    set lightness(value) {
        this.#lightness = this.#bounds(value, 100)
    }

    #alpha

    get alpha() {
        return this.#alpha
    }

    set alpha(value) {
        this.#alpha = this.#bounds(value, 1)
    }

    edit(h = 0, s = 0, l = 0, a = 0) {
        return new Colour(this.hue + h, this.saturation + s, this.lightness + l, this.alpha + a)
    }

    hueRotate(value) {
        return this.edit(value)
    }

    saturate(value) {
        return this.edit(0, value)
    }

    lighten(value) {
        return this.edit(0, 0, value)
    }

    opacity(value) {
        return this.edit(0, 0, 0, value)
    }

    get hsla() { //move to function maybeç
        return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`
    }
}