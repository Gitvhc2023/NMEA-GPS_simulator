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
    let normalBounds
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        icon: path.join(__dirname, './assets/64x64.png'),
        frame: false,        // ❌ quita barra nativa
        resizable: true,
        maximizable: false,
        fullscreenable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            //icon: "./assets/64x64.png"
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


// abrir
ipcMain.handle('serial:open', (_, path) => {
    openPort(path)
})

// cerrar
ipcMain.handle('serial:close', () => {
    closePort()
})

//estado
ipcMain.handle('serial:status', () => {
    return getStatus()
})
ipcMain.on("exit-app", (event,data) => {
  console.log('exit app>',data);
  app.quit();
  
})
ipcMain.on('window:minimize', () => {
  BrowserWindow.getFocusedWindow().minimize()
})

ipcMain.on('window:close', () => {
  BrowserWindow.getFocusedWindow().close()
})