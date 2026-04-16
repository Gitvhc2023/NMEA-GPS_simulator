<template>
    <div class="console-log" v-if="gpsState.log">
        <pre>{{ logs }}</pre>
    </div>
    <div class="signal-strength" v-if="!gpsState.log">
        <signalStrength1 :satellites="gpsState.seenSatellites" />
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue'
    import { generateFrames } from '../services/nmeaService'
    import { gpsState } from '../store/gpsStore'
    import signalStrength1 from './signalStrength1.vue'

    const logs = ref('')
    let logInterval = null
    const isElectron = ref(false)
    function createLog(){
        const dataFrame = generateFrames(gpsState)
        logs.value = Object.values(dataFrame).join('\n')
        if(dataFrame.gsv){
            gpsState.seenSatellites = parseGSV(dataFrame.gsv)
        }

    }
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
    
    watch(() => gpsState.moving, (val) => {
        console.log("moving",val)
        if(val==true){
            logInterval = setInterval(() => {
                const data = generateFrames(gpsState)
                gpsState.seenSatellites = parseGSV(data?.gsv)
                logs.value = Object.values(data).join('\n')
                if(isElectron) {
                    window.electronAPI?.sendNMEA(logs.value)
                } 
            }, 1000)

        }else{
            createLog()
            clearInterval(logInterval)
        }
        
    })
    onMounted(() => {
        createLog()
        isElectron.value = !!window.electronAPI
    })
    
</script>
<style >
.console-log {
  max-height: 100vh;
  height: 150px;
  
  overflow-y: auto;
  background: black;
  color: lime;
  padding: 5px;
  text-align: left;
  font-size: 0.80rem;
 
}
.signal-strength {
   /*  max-height: 170px; */
    /* height: 210px; */
    /* background: black; */
    padding: 5px;
   
 
}
</style>