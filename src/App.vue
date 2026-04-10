<script setup>
  import MapView from './components/MapView.vue';
  import ControlPanel from './components/ControlPanel.vue';
  import NMEAConsole from './components/NMEAConsole.vue';
  import signalStrength from './components/signalStrength.vue';
  import { ref,inject } from 'vue'
  import { gpsState } from './store/gpsStore';
  import { plotsGPS } from './services/parserService';
  import IMEX from './services/IMEX';
  import snackbar from './components/snackbar.vue';
  
  const viewLog = ref(false)
  /* const { toast } = inject('snackbar') */
  const viewSnackbar = inject('snackbar')
  function seeLog() {
        viewLog.value = !viewLog.value
        viewLog.value ? !gpsState.log : gpsState.log
        gpsState.log = viewLog.value
        console.log("mostra taps",viewLog.value)
  }
  async function importLog(params) {
    try {
          var result = await IMEX.import("log", ".log");
    } catch (error) {
        console.log(error)
    }
    if(result.name.indexOf("nmea.log") > -1){
        var lineas = result.data.split('\n');
        lineas.pop()
        var count = 0;
        let datanmea = {}
        for(var linea of lineas) {
          count++;
          
          if(""!=linea) datanmea = plotsGPS(linea)
          if (lineas.length==count) {
            console.log("frame-count",count)
            /* this.$emit("frame-count",count); */
          }
          if(!datanmea) continue
          console.log("llenar..",datanmea)
          /* this.uploadFile = Object.assign({},datanmea) */
        }

      }else{
        console.log('espefique el archivo, debe ser nmea.log')
        viewSnackbar.toast("spefique el archivo, debe ser nmea.log","error")
        
      }


    
  }

</script>

<template>
  <v-card >
    <v-toolbar density="compact" color="primary">
      <v-toolbar-title text="Toolbar"></v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-slot:append>
        <v-tooltip location="bottom" :text="viewLog ? 'View satellites visibles':'View raw GPS NMEA sentences'">
          <template v-slot:activator="{ props }">
            
            <v-btn v-bind="props" @click="seeLog" icon >
              <v-icon small > {{viewLog ? 'mdi-console-line' : 'mdi-chart-bar'}} </v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        

        <v-btn @click="importLog" icon="mdi-file-import-outline"></v-btn>

        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
      </v-toolbar>
      <div class="gps-layout">
      <div class="sidebar">
        <ControlPanel />
      </div>

      <div class="map">
        <MapView />
      </div>

      <div class="console">
        <NMEAConsole />
      </div>
    </div> 
    <snackbar />
    </v-card>
  
    
  <!-- <v-container fluid >
    
    
    <div class="gps-layout">
      <div class="sidebar">
        <ControlPanel />
      </div>

      <div class="map">
        <MapView />
      </div>

      <div class="console">
        <NMEAConsole />
      </div>
    </div> 
  </v-container> -->
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
.gps-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: 1fr 180px;
  height: 100vh;
  overflow: hidden;
}

/* Panel izquierdo */
.sidebar {
  grid-row: 1 / span 2;
 /*  overflow-y: auto; */
}

/* Mapa */
/* .map {
  background: #ddd;
} */

/* Consola */
.console {
  overflow-y: auto;
  padding: 5px;
}
</style>
