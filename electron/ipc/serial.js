const { SerialPort } = require('serialport')

let port = null

function initSerial() {
    port = new SerialPort({
        path: 'COM3', // cambiar según tu sistema
        baudRate: 9600
    })
}

function sendNMEA(data) {
    if (!port) return

    Object.values(data).forEach(frame => {
        port.write(frame + '\r\n')
    })
}

module.exports = {
    initSerial,
    sendNMEA
}