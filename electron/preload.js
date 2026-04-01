const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendNMEA: (data) => ipcRenderer.send('nmea:data', data)
})