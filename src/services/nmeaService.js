import NMEA from '../../libs/nmea.js'

const nmea = new NMEA()

export function generateFrames(state) {
    return nmea.encodeAll(state)
}