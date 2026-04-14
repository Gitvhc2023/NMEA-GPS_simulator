const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { initSerial,
    listPorts,
    openPort,
    closePort,
    getStatus,
    sendNMEA } = require('./ipc/serial')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    })

    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
    mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission) => {
        console.log("Electron perssion>>",permission);
        if(permission === 'serial'){
            console.log('permission')
            return true
        }
        return false
  })
}

app.whenReady().then(() => {
    createWindow()
    initSerial(mainWindow)
})

// enviar datos
ipcMain.on('nmea:data', (_, data) => {
    sendNMEA(data)
})
// 🔥 ESTE TE FALTABA
ipcMain.handle('serial:list', async () => {
    return await listPorts()
})


// 🔌 abrir
ipcMain.handle('serial:open', (_, path) => {
    console.log("abrir puerto:",path)
    openPort(path)
})

// 🔌 cerrar
ipcMain.handle('serial:close', () => {
    closePort()
})

// 📊 estado
ipcMain.handle('serial:status', () => {
    return getStatus()
})
ipcMain.on("exit-app", (event,data) => {
  console.log('exit app>',data);
  app.quit();
  
})