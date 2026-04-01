<script setup>
  import MapView from './components/MapView.vue';
  import ControlPanel from './components/ControlPanel.vue';
  import NMEAConsole from './components/NMEAConsole.vue';
</script>

<template>
  <v-container fluid >
    
    <v-row no-gutters>
      
      <v-col cols="4">
        <ControlPanel />
      </v-col>
      
      <v-col cols="8">
        <div class="row-container">
          <MapView />
          <NMEAConsole class="posicion" />
        </div>
        
      </v-col>
    </v-row>
    <!-- CONSOLA ABAJO -->
    <!-- <v-row>
      <v-col cols="12">
        <NMEAConsole />
      </v-col>
    </v-row> -->
  </v-container>
</template>
<style>
.app-container {
  height: 100vh;
  background: #0f172a; /* oscuro */
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

.container div {
  background-color: #f1f1f1;
  text-align: center;
  padding: 10px;
  font-size: 30px;
}

.item1 {
  grid-row: 1 / span 2;
}
</style>
