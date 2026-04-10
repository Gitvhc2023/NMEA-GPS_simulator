const { app, BrowserWindow, ipcMain } = require('electron')
const { initSerial, sendNMEA } = require('./ipc/serial')
let mainWindow
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1300,
        height: 800,
        webPreferences: {
            preload: __dirname + '/preload.js'
        }
    })

    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
    initSerial()
})

ipcMain.on('nmea:data', (_, data) => {
    sendNMEA(data)
})