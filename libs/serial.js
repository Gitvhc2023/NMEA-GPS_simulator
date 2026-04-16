/* eslint-disable */
'use strict';

/* const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline') */
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

let port = null
let listeners = []

function emit(event) {
  listeners.forEach(cb => cb(event))
}

export function onSerialEvent(callback) {
  listeners.push(callback)
}

export async function openSerial(portname) {
  port = new SerialPort({
    path: portname,
    baudRate: 115200,
    stopBits: 1,
    rtscts: false,
    lock: false,
  })

  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

  port.on("open", () => {
    emit({ status: "connected" })
  })

  port.on("error", (err) => {
    emit({ status: "error", data: err.message })
  })

  parser.on("data", (data) => {
    data = data.replace("\r", "").replace("\n", "")
    emit({ status: "data", data })
  })
}

export function writeSerial(text = "") {
  if (!port) return
  port.write(text + '\r\n')
}

export function closeSerial() {
  if (!port) return
  port.close()
  emit({ status: "disconnected" })
}

export async function listPorts() {
  try {
    const ports = await SerialPort.list()
    return ports
  } catch (err) {
    return []
  }
}