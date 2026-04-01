const { app, BrowserWindow, ipcMain } = require('electron')
const { initSerial, sendNMEA } = require('./ipc/serial')

function createWindow() {
    const win = new BrowserWindow({
        width: 1300,
        height: 800,
        webPreferences: {
            preload: __dirname + '/preload.js'
        }
    })

    win.loadURL('http://localhost:5173')
}

app.whenReady().then(() => {
    createWindow()
    initSerial()
})

ipcMain.on('nmea:data', (_, data) => {
    sendNMEA(data)
})