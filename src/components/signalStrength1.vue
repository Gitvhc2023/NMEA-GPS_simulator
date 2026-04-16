<template>
  <div>
    <Bar :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  satellites: Array,
  default: () => []
})

const chartData = computed(() => ({
  labels: props.satellites.map(s => `PRN ${s.prn}`),

  datasets: [
    {

        label: 'SNR',
        data: props.satellites.map(s => s.snr),
        backgroundColor: props.satellites.map(s => {
            if (s.snr > 40) return '#22c55e'
            if (s.snr > 20) return '#facc15'
            return '#ef4444'
        })
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: { display: false }
  },

  scales: {
    y: {
      min: 0,
      max: 60,
      ticks: {
        stepSize: 10
      },
        title:{
        display:true,
        text:"Elevation (degrees)"
      }
    },
  },
  
}
</script>