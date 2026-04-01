<template>
    
    <v-card class="map-card">
        <div id="map">
            <Compass :heading="gpsState.heading" />
        </div>
    </v-card>
    <!-- <v-divider></v-divider>
    <div style="height: 25hv; position: relative; bottom: 0;left: 0;width: 100%;">
      <NMEAConsole />
    </div> -->
    
</template>

<script setup>
import Compass from './compas.vue'
import { onMounted, watch } from 'vue'
import iconmark from "../assets/marker-icon-2x-blue.png";
import iconshadow from "../assets/marker-shadow.png";
import L from 'leaflet'
import "leaflet/dist/leaflet.css";
import 'leaflet-rotatedmarker'

import { gpsState } from '../store/gpsStore';
import NMEAConsole from './NMEAConsole.vue';

let polyline
let marker = [];
let map = null;
let circle = null;
let compass = 0
let path = []
let lastPos = [gpsState.lat, gpsState.lon]

const MAX_POINTS = 100

onMounted(() => {
    updatemap()
})

function hasMoved(prev, current) {
    const threshold = 0.00001
    return (
        Math.abs(prev[0] - current[0]) > threshold ||
        Math.abs(prev[1] - current[1]) > threshold
    )
}
function updatemap() {
      var redIcon = new L.Icon({
        iconUrl: iconmark,
        shadowUrl: iconshadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      var coords = L.latLng(gpsState.lat, gpsState.lon);
    
      if (!map) {
        console.log('Creating map')
        map = L.map("map", {
          // Set latitude and longitude of the map center (required)
          //center:[37.7833, -122.4167],
          center: coords, //[37.7833, -122.4167],
          // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
          zoom: 16,
          scrollWheelZoom: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        marker = L.marker(coords, { icon: redIcon }).addTo(map);
        marker.setRotationAngle(gpsState.heading) 
        polyline = L.polyline([], { color: 'blue' }).addTo(map)
        
        circle = L.circle(coords, {
          color: "#0096d8",
          fillColor: "#d8f3ff",
          fillOpacity: 0.5,
          radius: 80,
        }).addTo(map);
        // Adding marker to the map
        
      } else {

        
        map.setView(coords, 16);
        if (marker) { // check
              map.removeLayer(marker);
              map.removeLayer(circle);
              map.removeControl(compass);
          }
         
        marker = new L.Marker(coords,{ icon: redIcon }).addTo(map); //
        //marker.setRotationAngle(gpsState.heading) 
        polyline = L.polyline([], { color: 'blue' }).addTo(map)
      }
    }

watch(() => [gpsState.lat, gpsState.lon], () => {

    if (!gpsState.moving) return // 🔥 clave

    const pos = [gpsState.lat, gpsState.lon]

    // evitar ruido
    if (!hasMoved(lastPos, pos)) return

    // actualizar marcador
    marker.setLatLng(pos)

    // limitar path
    path.push(pos)
    if (path.length > MAX_POINTS) path.shift()

    polyline.setLatLngs(path)

    // movimiento suave del mapa
    map.setView(pos, map.getZoom(), {
        animate: true,
        duration: 0.5
    })

    lastPos = pos
})
</script>

<style>
.map-card {
  height: 75vh;
}
#map {
  height: 100%;
}

</style>