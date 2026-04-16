import { ref } from 'vue'
import {
  onSerialEvent,
  openSerial,
  closeSerial,
  writeSerial,
  listPorts
} from '../../libs/serial'
//import { openSerial } from '../../libs/serial'

//import { parseNMEA } from '@/services/nmeaParser'
import { generateFrames } from './nmeaService'


export function useSerial() {

    const isConnected = ref(false)
    const rawData = ref("")
    const parsedData = ref(null)
    const error = ref(null)
    const isElectron = process.env.IS_ELECTRON

    onSerialEvent((event) => {
        switch (event.status) {
        case "connected":
            isConnected.value = true
            break

        case "disconnected":
            isConnected.value = false
            break

        case "data":
            rawData.value = event.data
            parsedData.value = generateFrames(event.data)
            break

        case "error":
            error.value = event.data
            break
        }
    })

  return {
    isElectron: process.env.IS_ELECTRON,
    isConnected,
    rawData,
    parsedData,
    error,
    openSerial,
    closeSerial,
    writeSerial,
    listPorts
  }
}