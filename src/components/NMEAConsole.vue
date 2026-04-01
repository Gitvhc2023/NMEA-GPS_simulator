<template>
    <div class="console">
        <pre>{{ logs }}</pre>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { generateFrames } from '../services/nmeaService'
    import { gpsState } from '../store/gpsStore'

    const logs = ref('')

    setInterval(() => {
        const data = generateFrames(gpsState)
        logs.value = Object.values(data).join('\n')
    }, 1000)
</script>
<style>
.console {
  max-height: 150px;
  overflow-y: auto;
  background: black;
  color: lime;
  padding: 10px;
  text-align: left;
  font-size: 0.80rem
}
</style>