let audioclick = false, audio

onclick = () => {
    if (audioclick) return false;
    audioclick = true;

    let audioContext = new (window.AudioContext || window.webkitAudioContext)();

    audio = {
        _filter: 0,
        filterNode: audioContext.createBiquadFilter(),
        gainNodes: [audioContext.createGain(), audioContext.createGain()],
        tracks: ["highpass", "lowpass"],

        get filter() {
            return this._filter;
        },

        set filter(value) {
            if (value < 0 || value > 100) {
                throw new Error(`filter value set to ${value}!`);
                return false;
            }

            this._filter = value;

            let gainValue1 = value / 100;
            let gainValue2 = 1 - (value / 100);

            let currentTime = audioContext.currentTime;
            this.gainNodes[0].gain.linearRampToValueAtTime(gainValue1, currentTime + INTERVAL / 1000);
            this.gainNodes[1].gain.linearRampToValueAtTime(gainValue2, currentTime + INTERVAL / 1000);
        },

        loadTracks() {
            this.tracks = this.tracks.map((type, index) => {
                let track = new Audio(`sound/${type}.wav`);
                track.loop = true;

                let source = audioContext.createMediaElementSource(track);
                source.connect(this.gainNodes[index]);
                this.gainNodes[index].connect(audioContext.destination);

                return track;
            });
        },

        playTracks() {
            this.tracks.forEach(track => track.play());
        }
    }

    audio.loadTracks();

    audio.tracks.forEach(track => {
        track.oncanplaythrough = () => {
            audio.playTracks();
        };
    });

    audio.filter = 0;
    startVisual()
};