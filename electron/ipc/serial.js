const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

let port = null
let isOpen = false
let mainWindow = null
let isError = false
let message = ""
const callbackWritten = []


function Written (data, callback) {
    
    port.write(data, function (err, res) {
        if (err) {
            callbackWritten.splice(callbackWritten.indexOf(callback), 1);
            callback({ status: "Error write", data: err.message});
        };
        port.drain(err => {
            if (err) {
            callbackWritten.splice(callbackWritten.indexOf(callback), 1);
            callback({ status: "Error drain", data: err.message});
            }
        });
    });
    callbackWritten.unshift(callback);
};
function initSerial(win) {
    mainWindow = win
}

//listar puertos
async function listPorts() {
    //return await SerialPort.list()
    const portList = await SerialPort.list()
    return portList.filter((data=> data.productId))
}

//abrir puerto
function openPort(path, baudRate = 115200) {
    console.log("mostrar puerto..",path)
    if (port && isOpen) return
    isError=false
    message = "" 
    port = new SerialPort({ path, baudRate,
    stopBits: 1,
    rtscts: false,
    lock: false, })
    /* const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))   */  
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
        isError  = true
        //closePort()
        message = err.message
        sendStatus()
    })
    /* parser.on("data", function(data) {
        data = data.replace("\r", "").replace("\n", "");
        callbackWritten.pop()({ status: "parse", data: data})
    }); */
}

// cerrar puerto
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

//estado actual
function getStatus() {
    return isOpen
}

//enviar estado a Vue
function sendStatus() {
    if (mainWindow) {
        mainWindow.webContents.send('serial:status', isOpen)
    }
    if(isError) mainWindow.webContents.send('serial:error',{"text-error": message} )
       
}
function sendNMEA(data) {
    if (!port) return
    if(typeof data === 'object') return '\r\n'
    /* console.log(data) */
    port.write(data+'\r\n')
}

module.exports = {
    initSerial,
    listPorts,
    openPort,
    closePort,
    getStatus,
    sendNMEA
}
