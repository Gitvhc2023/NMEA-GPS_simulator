import { reactive } from 'vue'

export const gpsState = reactive({
    lat: 4.67034,
    lon: -74.05402,
    alt: 0,
    speed: 1,
    heading: 0,
    fix: 1,
    satellites: 6,
    seenSatellites:[],
    hdop: 0.5,
    moving: false,
    log:true,
    date: new Date()
})