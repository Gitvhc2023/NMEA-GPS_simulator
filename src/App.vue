<script setup>
  import MapView from './components/MapView.vue';
  import ControlPanel from './components/ControlPanel.vue';
  import NMEAConsole from './components/NMEAConsole.vue';
  import signalStrength from './components/signalStrength.vue';
</script>

<template>
  <v-card >
    <v-toolbar density="compact" color="primary">
      <v-toolbar-title text="Toolbar"></v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-slot:append>
        <v-btn icon="mdi-magnify"></v-btn>

        <v-btn icon="mdi-heart"></v-btn>

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
        <!-- <signalStrength /> -->
      </div>
    </div> 

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
