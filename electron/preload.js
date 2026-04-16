const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendNMEA: (data) => ipcRenderer.send('nmea:data', data),

    onSerialData: (callback) => {
        ipcRenderer.on('serial:data', (_, data) => callback(data))
    },

    listSerialPorts: () => ipcRenderer.invoke('serial:list'),
    openSerial: (path) => ipcRenderer.invoke('serial:open', path),
    closeSerial: () => ipcRenderer.invoke('serial:close'),

    getSerialStatus: () => ipcRenderer.invoke('serial:status'),

    onSerialStatus: (callback) => {
        ipcRenderer.on('serial:error', (_, status) => callback(status))
        ipcRenderer.on('serial:status', (_, status) => callback(status))
    },
    minimize: () => ipcRenderer.send('window:minimize'),
    close: () => ipcRenderer.send('window:close')
})