<template>
    <div class="console-log" v-if="gpsState.log">
        <pre>{{ logs }}</pre>
    </div>
    <div v-if="!gpsState.log">
        <signalStrength1 :satellites="gpsState.seenSatellites" />
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { generateFrames } from '../services/nmeaService'
    import { gpsState } from '../store/gpsStore'
    import signalStrength1 from './signalStrength1.vue'

    const logs = ref('')
   
    function parseGSV(sentence) {
        const parts = sentence.split(',')

        const sats = []

        for (let i = 4; i < parts.length; i += 4) {
            sats.push({
                prn: parts[i],
                elevation: parts[i + 1],
                azimuth: parts[i + 2],
                snr: parseInt(parts[i + 3]) || 0
            })
        }
        return sats
    }
    setInterval(() => {
        const data = generateFrames(gpsState)
        logs.value = Object.values(data).join('\n')
        if(data.gsv){
            gpsState.seenSatellites = parseGSV(data.gsv)
        }
    }, 1000)
</script>
<style >
.console-log {
  max-height: 150px;
  overflow-y: auto;
  background: black;
  color: lime;
  padding: 10px;
  text-align: left;
  font-size: 0.80rem
}
</style>