<template>
    <v-card 
        class="mx-auto"
        max-width="350"
        >
        <v-card-text>
            <!-- <SerialView v-if="isElectron" class="gps-input"  /> -->
            <v-row no-gutters v-if="isElectron">
                 <v-col cols="3">Devices</v-col>
                <v-col cols="9">
                     <SerialView class="gps-input"  />
                </v-col>

            </v-row>
            <v-row no-gutters >
                <v-col cols="12" class="text-left mb-3 mt-n2">
                    <v-btn variant="flat" block style="height: 30px;" small  spaced="end"  @click="toggle" >{{'Simulation'}}
                        <v-spacer></v-spacer>
                        <v-icon small :color="moving==false ? 'silver' : 'primary'"> {{moving ? 'mdi-pause' : 'mdi-play'}} </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters >
                <v-col cols="4" class="text-left" @click="parseTime">{{ ("UTC Time") }}:</v-col>
                <v-col cols="8" class="text-center" >
                    <v-input>{{ state.time }}</v-input>
                </v-col>
            </v-row>
            <v-row no-gutters >
                <v-col cols="4">Latitude</v-col>
                <v-col cols="8"> 
                    <coordinates v-model="state.lat"
                        :step="0.001"
                        :min="-90"
                        :max="90"
                        :disabled="moving"
                        class="gps-input"/>
                </v-col>
            </v-row>
            <v-row no-gutters class="row-container">
                <v-col cols="4">Longitude</v-col>
                <v-col cols="8" > 
                    <coordinates v-model="state.lon"
                        :step="0.001"
                        :min="-180"
                        :max="180"
                        :disabled="moving"
                        class="gps-input"/>
                </v-col>
            </v-row>
            <v-row no-gutters class="row-container">
                <v-col cols="4">Altitude</v-col>
                <v-col cols="8" > 
                    <coordinates v-model="state.alt"
                        :step="0.01"
                        :min="0"
                        :max="5000"
                        class="gps-input"/>
                </v-col>
            </v-row>
            
            <v-row no-gutters class="row-container">
                <v-col cols="4">Speed</v-col>
                <v-col cols="8"> 
                    <v-number-input
                        v-model.number="state.speed"
                        density="compact"
                        variant="outlined"
                        control-variant="stacked"
                        :step="1"
                        :min="0"
                        class="gps-input"
                        
                    ></v-number-input></v-col>
            </v-row>
            <v-row no-gutters class="row-container">
                <v-col cols="4">Heading</v-col>
                <v-col cols="8"> 
                    <v-number-input
                        v-model.number="state.heading"
                        density="compact"
                        variant="outlined"
                        control-variant="stacked"
                        :step="1"
                        class="gps-input"
                    ></v-number-input></v-col>
            </v-row>
            <v-row no-gutters class="row-container">
                <v-col cols="4">Signal Quality</v-col>
                <v-col cols="8"> 
                    <v-select
                        v-model="selectQty"
                        :items="fixQty"
                        item-title="value"
                        item-value="value"
                        :label="selectQty.info"
                        return-object
                        density="compact"
                        variant="outlined"
                        control-variant="stacked"
                        class="gps-input"
                        @update:modelValue="setCommand(selectQty.value,'fix')"
                        :class="`label-${fixQuality.color}`"
                    >
                    </v-select>
                </v-col>
            </v-row>
            <v-row no-gutters class="row-container">
                <v-col cols="4">Fix Type</v-col>
                <v-col cols="8"> 
                    <v-select
                        v-model="selectFix"
                        :items="fix"
                        item-title="value"
                        item-value="value"
                        :label="selectFix.info"
                        return-object
                        density="compact"
                        variant="outlined"
                        control-variant="stacked"
                        class="gps-input"
                        @update:modelValue="setCommand(selectFix.value,'fix_type')"
                        :class="`label-${fixSignal.color}`"
                    >
                        <!-- <template #prepend-inner>
                            <v-icon
                                :color="fixSignal.color"
                                icon="mdi-circle-medium"
                                style="pointer-events: none;"
                            />
                        </template> -->
                    
                    </v-select>
                </v-col>
            </v-row>
            <v-row no-gutters class="row-container">
                <v-col cols="4" class="text-left">{{ ("Satellites in Use") }}:</v-col>
                <v-col cols="8">
                <v-number-input 
                    v-model.number="state.satellites"
                    :step="1"
                    :min="1" 
                    :max="12"
                    density="compact"
                    variant="outlined"
                    control-variant="stacked"
                    class="gps-input"
                ></v-number-input>
                </v-col>
            </v-row>
            <v-row no-gutters class="row-container">
                <v-col cols="4" class="text-left">{{("PDOP") }}:</v-col>
                <v-col cols="8">
                    <DiluciónPrecisiónInput class="gps-input" v-model="state.pdop" />
                </v-col>
            </v-row>
            <v-row no-gutters class="row-container">
                <v-col cols="4" class="text-left">{{ ("VDOP") }}:</v-col>
                <v-col cols="8">
                    <DiluciónPrecisiónInput class="gps-input" v-model="state.vdop" />
                </v-col>
            </v-row>
            <v-row no-gutters class="row-container">
                <v-col cols="4" class="text-left">{{("HDOP") }}:</v-col>
                <v-col cols="8">
                    <DiluciónPrecisiónInput class="gps-input" v-model="state.hdop" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

</template>

<script setup>
    
    import { onMounted,ref, watch, shallowRef, computed } from 'vue'
    import { useGPS } from '../control/controlGPS'
    import DiluciónPrecisiónInput from './diluciónPrecisiónInput.vue'
    import coordinates from './coordinates.vue'
    import SerialView from './SerialView.vue'


    const { state, start, stop } = useGPS()
    const hdopInput = ref('0.5')
    const moving = ref(false)
    const isElectron = ref(false)
    const selectQty = shallowRef({ value:1,info:'GPS fix (SPS)'})
    const fixQty = [
          {value:0,info:'Fix not available'},
          {value:1,info:'GPS fix (SPS)'},
          {value:2,info:'DGPS fix'},
          {value:3,info:'PPS fix'},
          {value:4,info:'RTK fix'},
          {value:5,info:'RTK float'},
          {value:6,info:'Dead reckoning'},
          {value:7,info:'Manual'},
          {value:8,info:'Simulated'}]
    const selectFix = shallowRef({value:2,info:'2D-GPS fix'})
    const fix = [
        {value:1,info:'Fix not available'},
        {value:2,info:'2D-GPS fix'},
        {value:3,info:'3D-GPS fix'},]
    const changeHdop = (step) => {
        let val = parseFloat(hdopInput.value) || 0.5
        val = Math.max(0.5, Math.round((val + step) * 10) / 10)
        hdopInput.value = val.toFixed(1)
        state.hdop = val
    }   
    function toggle() {
        moving.value = !moving.value
        moving.value ? start() : stop()
    }
    function parseTime(){
        console.log("Time...",state)
    }
    function setCommand(value,label){

        if(!label)return -1
        if(label=="fix"){
            state.fix = value
        }
        else if(label=="fix_type"){
            state.fixType = value
        }
        console.log("Time...",label,value)
    }
    watch(() => state.heading, (val) => {
        if (val > 359) state.heading = 0
        if (val < 0) state.heading = 359
    })
    const fixSignal = computed(() => {
  
        const signal = selectFix.value?.value
        if (signal==1) return { color: 'error' }
        if (signal==2) return { color: 'warning' }
        if (signal==3) return { color: 'success' }

    })
    const fixQuality = computed(() => {
  
        const quality = selectQty.value?.value
        switch (quality) {
            case 0:
                return { color: 'error' }
            case 1:
                return { color: 'warning'}
            case 2:
                return { color: 'success' }
            case 3:
                return { color: 'success' }
            case 4:
                return { color: 'warning' }    
            case 5:
                return { color: 'warning' }
            case 6:
                return { color: 'error' }
            case 7:
                return { color: 'error' }
            case 8:
                return { color: 'error' }                
            default:
                return { color: 'grey' }
        }
    })
    onMounted(() => {
        isElectron.value = !!window.electronAPI
    })
</script>
<style scoped>
.panel {
  height: 100%;
  background: #111827;
  color: white;
  padding: 10px;
}

:deep(.title) {
  color: #22c55e;
}

:deep(.section) {
  margin-top: 20px;
}
:deep(.row-container) {
    margin-top: -20px;
}
:deep(.gps-input) {
  width: 140px;

}
:deep(.label-error .v-label) {
  color: #ff5252 !important;
}

:deep(.label-warning .v-label) {
  color: #fb8c00 !important;
}

:deep(.label-success .v-label) {
  color: #4caf50 !important;
}

:deep(.gps-input .v-field) {
  height: 38px !important;
}

:deep(.gps-input .v-field__input) {
  min-height: 38px !important;
  padding: 0 8px;
}

</style>