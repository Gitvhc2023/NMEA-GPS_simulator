export default class GPSEngine {
    constructor(state) {
        this.state = state
        this.interval = null
    }

    start() {
        if (this.interval) return

        this.interval = setInterval(() => {
            this.updatePosition()
        }, 1000) // cada segundo
    }

    stop() {
        clearInterval(this.interval)
        this.interval = null
    }

    updatePosition() {
        if (this.state.speed <= 0) return

        const R = 6371 // km
        const d = this.state.speed / 3600 // km por segundo

        const headingRad = this.toRad(this.state.heading)

        const lat1 = this.toRad(this.state.lat)
        const lon1 = this.toRad(this.state.lon)

        const lat2 = Math.asin(
            Math.sin(lat1) * Math.cos(d / R) +
            Math.cos(lat1) * Math.sin(d / R) * Math.cos(headingRad)
        )

        const lon2 = lon1 + Math.atan2(
            Math.sin(headingRad) * Math.sin(d / R) * Math.cos(lat1),
            Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2)
        )

        this.state.lat = this.toDeg(lat2)
        this.state.lon = this.toDeg(lon2)
        this.state.date = new Date()
    }

    toRad(deg) {
        return deg * Math.PI / 180
    }

    toDeg(rad) {
        return rad * 180 / Math.PI
    }
}