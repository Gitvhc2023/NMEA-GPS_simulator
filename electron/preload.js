const { contextBridge, ipcRenderer } = require('electron')
//process.env.isElectron
contextBridge.exposeInMainWorld('electronAPI', {
    // 📤 Enviar datos al main
    sendNMEA: (data) => ipcRenderer.send('nmea:data', data),

    // 📥 Recibir datos del main (serial, logs, etc)
    onSerialData: (callback) => {
        ipcRenderer.on('serial:data', (_, data) => {
            callback(data)
        })
    },
    // 🔥 NUEVO: obtener puertos
    listSerialPorts: () => ipcRenderer.invoke('serial:list')
})