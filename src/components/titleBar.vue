<template>
  <div class="titlebar" >

    <div class="left">
      <v-icon size="18">mdi-crosshairs-gps</v-icon>
      <span>GPS Simulator</span>
    </div>

    <!-- Controles -->
    <div class="controls">
      
      <v-tooltip location="bottom" :text="viewPanel ? 'View satellites visibles':'View raw GPS NMEA sentences'">
        <template v-slot:activator="{ props }">
          <v-btn variant="text" class="win-btn"  v-bind="props" @click="$emit('get-panel')"  >
            <v-icon  > {{ viewPanel ? 'mdi-console-line' : 'mdi-chart-bar' }}</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip location="bottom" text="Import file">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            color="white"
            v-bind="props"
            icon
            class="win-btn"
            @click="$emit('view-log')"
        >
        <v-icon >mdi-file-import-outline</v-icon>
      </v-btn>

        </template>
      </v-tooltip>
      
      <v-spacer></v-spacer>
      <v-btn variant="text"  size="x-small" icon @click="minimize">
        <v-icon size="14" >mdi-window-minimize</v-icon>
      </v-btn>
      <v-btn variant="text" size="x-small" icon @click="close">
        <v-icon size="14" color="red">mdi-close</v-icon>
      </v-btn>

    </div>

  </div>
</template>

<script>
export default {
  props: {
    viewPanel: Boolean
  },
  emits: ["get-panel"],
  methods: {
    minimize() {
      window.electronAPI.minimize()
    },
    close() {
      window.electronAPI.close()
    }
  }
}
</script>

<style scoped>
.titlebar {
  height: 40px; 
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  -webkit-app-region: drag; /*permite arrastrar */
  background-color: rgb(var(--v-theme-primary));
  /* color: white; */
}
.win-btn {
  width: 28px;
  height: 24px;
  min-width: 28px;
  padding: 0;
  border-radius: 2px;
}

/* .win-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  
} */
.controls {
  display: flex;
  align-items: center;
  height: 100%;
  -webkit-app-region: no-drag; /* botones clickeables */
}
.left {
  display: flex;
  align-items: center;
  gap: 8px;
}

</style>