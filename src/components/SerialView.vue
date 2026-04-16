
<template>
  <div class="serial-bar">
      
     <!-- <span class="label">Device:</span> -->
     <v-select
        v-model="selectedPort"
        :items="ports"
        item-title="label"
        item-value="path"
        @click="loadPorts"
        density="compact"
        class="select"
        :disabled="isConnected"

      >
      </v-select>
      <v-btn size="small"
        variant="outlined" :color="isConnected ? 'silver' : 'primary'" @click="toggleConnection">
        <v-icon >{{isConnected ? 'mdi-power-plug-off-outline ' : 'mdi-power-plug-outline'}}</v-icon>
      </v-btn>
      

  </div>

</template>

<script >
import { inject } from 'vue'


export default {
  setup() {
    const viewSnackbar = inject('snackbar')

    const snackbar = (message,type) => {
      viewSnackbar.toast(message, type)
    }

    return { snackbar }
  },
  data() {
    return {
      ports: [],
      selectedPort: null,
      isConnected: false,
      isElectron: false
    }
  },
  async mounted() {
    // estado inicial
    this.isConnected = await window.electronAPI?.getSerialStatus()
    // escuchar cambios
    window.electronAPI.onSerialStatus((status) => {
      this.isConnected = status
    })
  },
  methods: {
    async loadPorts() {
      const result = await window.electronAPI?.listSerialPorts()
      console.log("serial..",result)
      this.ports = result?.map(p => ({
        path: p.path,
        //label: `${p.path} (${p.manufacturer || 'Unknown'})`
        label: `${p.path}`
      }))
    },
    async toggleConnection() {
      if (!this.selectedPort) {
        
        this.snackbar("Device not found","warning")
        return
      }

      if (this.isConnected) {
        console.log("desconetar com",this.selectedPort)
        await window.electronAPI?.closeSerial()

      } else {
        console.log("conectar com",this.selectedPort)
        await window.electronAPI?.openSerial(this.selectedPort)
        
        
      }
      this.serialStatus()
    },
    serialStatus() {
      window.electronAPI.onSerialStatus((status) => {
        
        console.log("estado serial..",status)
        if(status['text-error']) {
          this.snackbar(status["text-error"],"error")
          this.isConnected = false
          
        } 
        else if(status){
          this.snackbar("Connected device","success")
          
        } 
        else if(status===false) {
          this.snackbar("Disconnected device","warning")
          
        } 
        
      })

    }
  }
}
</script>
<style scoped>
.serial-bar {
  display: flex;
  align-items: center;
  gap: 6px;
}

.label {
  font-size: 14px;
}

.select {
  min-width: 140px;
  flex: 1;
  height:35px
}
</style>