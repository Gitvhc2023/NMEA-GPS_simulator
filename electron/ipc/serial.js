const { SerialPort } = require('serialport')
//const { ipcMain } = require('electron')
//import { inject } from 'vue'
//import snackbar from '../../src/components/snackbar.vue'

let port = null
let isOpen = false
let mainWindow = null
let isError = ""

//const viewSnackbar = inject('snackbar')

function initSerial(win) {
    mainWindow = win
}

// 📡 listar puertos
async function listPorts() {
    //return await SerialPort.list()
    const portList = await SerialPort.list()
    return portList.filter((data=> data.productId))
}

// 🔌 abrir puerto
function openPort(path, baudRate = 9600) {
    console.log("mostrar puerto..",path)
    if (port && isOpen) return

    port = new SerialPort({ path, baudRate })

    port.on('open', () => {
        isOpen = true
        sendStatus()
    })

    port.on('close', () => {
        isOpen = false
        sendStatus()
    })

    port.on('error', (err) => {
        console.error('Serial error>>:', err.message)
        isOpen = false
        //viewSnackbar.toast(err.message,"error")
        //closePort()
        mainWindow.webContents.send('serial:error',{"text-error":err.message} )

        sendStatus()
    })
}

// 🔌 cerrar puerto
function closePort() {
    if (port && isOpen) {
        port.close()
        port.on('close', () => {
            isOpen = false
            port = null
            sendStatus()
        })
    }
}

// 📊 estado actual
function getStatus() {
    return isOpen
}

// 📤 enviar estado a Vue
function sendStatus() {
    if (mainWindow) {
        mainWindow.webContents.send('serial:status', isOpen)
    }
}
function sendNMEA(data) {
    if (!port) return

    Object.values(data).forEach(frame => {
        port.write(frame + '\r\n')
    })
}

module.exports = {
    initSerial,
    listPorts,
    openPort,
    closePort,
    getStatus,
    sendNMEA
}
