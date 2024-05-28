let audio = {
    _filter: 0,
    get filter() {
        return this._filter
    },
    set filter(value) {
        if (value < 0 || value > 100) {
            throw new Error(`filter value set to ${value}!`)
            return false
        }
        this._filter = value
        this.tracks[0].volume = value / 100
        this.tracks[1].volume = 1 - (value / 100)
    },
    tracks: ["highpass", "lowpass"],
    active: false
}

onclick = () => {
    if (audio.active) return false
    else audio.active = true
    audio.tracks.map((i, j) => {
        audio.tracks[j] = new Audio(`sound/${i}.wav`)
        audio.tracks[j].oncanplaythrough = () => {
            audio.tracks[j].loop = true
            audio.tracks[j].play()
        }
    })
    audio.filter = 0
}