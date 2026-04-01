import { ref } from 'vue'
import { gpsState } from '../store/gpsStore'
import GPSEngine from '../services/gpsEngine'
import { generateFrames } from '../services/nmeaService'
import { plotsGPS } from '../services/parserService'

const engine = new GPSEngine(gpsState)

let intervalNMEA = null
const rawData = ref("")
export function useGPS() {

    function start() {
        gpsState.moving = true
        engine.start()

        intervalNMEA = setInterval(() => {
            if (!gpsState.moving) return
            const frames = generateFrames(gpsState)

            rawData.value = Object.values(frames).join('\r')
            rawGPS(rawData.value)

            window.electronAPI?.sendNMEA(frames)

        }, 1000)
    }
    
    function stop() {
        engine.stop()
        gpsState.moving = false
        console.log("Stop frames")
        clearInterval(intervalNMEA)
    }
    function rawGPS(rawLine){
        const parseGPS = {}
        var readLine = rawLine.toString().split("\r")
        var line = readLine.filter(function(el) {
            return el != ""
        });
        for(var linea of line) {
            const plotraw = plotsGPS(linea)
            var lineParse = Object.assign({},plotraw)
            
            Object.keys(lineParse).forEach(key => {
                if(!gpsState[key]){
                    parseGPS[key]=lineParse[key]
                }
                if (key.indexOf("time") > -1) {
                    var splitDate = lineParse[key].split(' ')
                    gpsState.time = `${splitDate[4]} ${splitDate[5]}`
                }
            });
        Object.assign(parseGPS)
        }
    }

    return {
        state: gpsState,
        start,
        stop
    }
}