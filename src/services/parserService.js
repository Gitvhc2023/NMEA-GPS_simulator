import parseNMEA from "../../libs/parseNMEA.js"

const raw = new parseNMEA()

export function plotsGPS(state) {
  return raw.isData(state)
}

