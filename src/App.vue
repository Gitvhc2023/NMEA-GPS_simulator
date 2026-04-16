<script setup>
  import MapView from './components/MapView.vue';
  import ControlPanel from './components/ControlPanel.vue';
  import NMEAConsole from './components/NMEAConsole.vue';
  import { ref,inject, onMounted } from 'vue'
  import { gpsState } from './store/gpsStore';
  import { plotsGPS } from './services/parserService';
  import IMEX from './services/IMEX';
  import snackbar from './components/snackbar.vue';
  import titleBar from './components/titleBar.vue';
  
  const viewLog = ref(false)
  const isElectron = ref(false)
  /* const { toast } = inject('snackbar') */
  const viewSnackbar = inject('snackbar')
  let panelObjects = {}
  function seeLog() {
        viewLog.value = !viewLog.value
        viewLog.value ? !gpsState.log : gpsState.log
        gpsState.log = viewLog.value
  }
  
  async function importLog(params) {
    try {
          var result = await IMEX.import("log", ".log");
    } catch (error) {
        console.log(error)
        viewSnackbar.toast("Problem importing the file","error")
        return
    }
    if(result.name.indexOf("nmea.log") > -1){
        var lineas = result.data.split('\n');
        lineas.pop()
        var count = 0;
        let datanmea = {}
        for(var linea of lineas) {
          count++;
          
          if(""!=linea) datanmea = plotsGPS(linea)
          if(isElectron) window.electronAPI?.sendNMEA(linea)
          if (lineas.length==count) {
            console.log("frame-count",count)
            //this.$emit("frame-count",count);
          }
          if(!datanmea) continue
          if (datanmea.time) {
              var splitDate = datanmea.time.split(' ')
              //gpsState.time = `${splitDate[4]} ${splitDate[5]}`
              datanmea.time = `${splitDate[4]} ${splitDate[5]}`
          }
          //console.log("llenar..",datanmea)
          panelObjects = Object.assign(datanmea)
          //Object.assign(gpsState,datanmea)
          
        }

      }else{
        console.log('espefique el archivo, debe ser nmea.log')
        viewSnackbar.toast("Specify the file; it must be nmea.log","error")
        
      }
  }
  onMounted(() => {
        isElectron.value = !!window.electronAPI
    })

</script>

<template>
  <v-card class="app-container">
    <titleBar @view-log="importLog" @get-panel="seeLog" :viewPanel="viewLog" class="primary"/>
  
    <div class="gps-layout">
      <div class="sidebar">
        <ControlPanel :viewControlPanel="panelObjects" />
      </div>
      
      <div >
        <MapView />
      </div>
      <div class="console">
        <NMEAConsole />
      </div>
    </div> 
    
    <snackbar />
    
  </v-card>
  
</template>
<style>
/* .app-container {
  height: 100vh;
  background: #0f172a; 
}
.row-container1 {
  height: auto;
  display: grid;
}
.posicion {
  position: relative; 
  bottom: 2px;
  left: 0;
  width: 100%;
}
.container {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 5px;
  background-color: dodgerblue;
  padding: 5px;
}

 */
 .app-container {
  height: 100vh;
  /* height: 710px; */
  width: auto;
  
 }
.gps-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: 1fr 320px;
  height: 100vh;
  overflow: hidden;
}

/* Panel izquierdo */
.sidebar {
  grid-row: 1 / span 2;
 /*  overflow-y: auto; */
}

.console {
  overflow-y: auto;
  /* padding: 1px; */
  /* height: 10vh */
  /* position: relative; */ 
}
</style>
