<template>
  <div ref="map" class="map"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerBlue from '../assets/blue.png'
import markerGray from '../assets/gray.png'
import markerGreen from '../assets/green.png'
import markerRed from '../assets/red.png'
import markerYellow from '../assets/yellow.png'
import '../scss/map.scss'

export default {
  data () {
    return {
      // center: [56.1803, 15.5906],
      center: [55.5652, 13.0481],
      baseXY: [55.5642, 13.0651],
      top: [55.5885],
      bottom: [55.5424],
      left: [13.0170],
      right: [13.0809],
      locationMarkerBlue: L.icon({
        iconUrl: markerBlue,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, 0]
      }),
      locationMarkerGreen: L.icon({
        iconUrl: markerGreen,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, 0]
      }),
      locationMarkerRed: L.icon({
        iconUrl: markerRed,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, 0]
      }),
      locationMarkerYellow: L.icon({
        iconUrl: markerYellow,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, 0]
      }),
      locationMarkerGray: L.icon({
        iconUrl: markerGray,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, 0]
      })
    }
  },
  methods: {
    setupLeafletMap: function () {
      const mapContainer = L.map(this.$refs.map).setView(this.center, 13)

      // Setup map
      L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
          attribution: 'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          accessToken: 'pk.eyJ1IjoiYXJlb25sIiwiYSI6ImNrdzFibmFndTE3N2gyeG5vcGlieXZsMWMifQ.S0ysiWIrgu-AbLrC_OAmKA'
        }
      ).addTo(mapContainer)
      // L.getJSON(data)
      // L.marker(this.center, {icon: this.locationMarker}).addTo(mapContainer).bindPopup("*Finger guns*");

      /**
       * Reload stations 1->3
       */
      L.circle(this.baseXY, {
        color: 'steelblue',
        fillColor: 'lightblue',
        fillOpacity: 0.5,
        radius: 500
      }).addTo(mapContainer).bindPopup('Reload station 1')
      L.circle([55.5885, 13.0170], {
        color: 'steelblue',
        fillColor: 'lightblue',
        fillOpacity: 0.5,
        radius: 500
      }).addTo(mapContainer).bindPopup('Reload station 2')

      // Create rectangle shape. Aka reload station
      var recXY = [[this.bottom[0], this.left[0]], [this.bottom[0] + 0.01, this.left[0] + 0.01]]

      L.rectangle(recXY, { color: '#ff7800', weight: 1 }).addTo(mapContainer).bindPopup('Reload station 3, the correct one')

      /**
       * Max cord maker
       */
      const arr = [...Array(200)]
      const maxX = (this.top - this.bottom).toFixed(4)
      const maxY = (this.right - this.left).toFixed(4)

      /**
       * Spew out markers randomly :D
       */
      let count = 0
      arr.forEach((_, i) => {
        const X = (this.bottom[0] + Math.random() * maxX).toFixed(4)
        const Y = (this.left[0] + Math.random() * maxY).toFixed(4)
        const position = [X, Y]
        // console.log(X, this.bottom[0])

        const mark = L.marker(position, { icon: this.locationMarkerGray })

        if ((X >= this.bottom[0] && X <= this.bottom[0] + 0.01) && (Y >= this.left[0] && Y <= this.left[0] + 0.01)) {
          mark.options.icon = this.locationMarkerGreen
          count++
        } else if (i % 3 === 0) {
          mark.options.icon = this.locationMarkerBlue
        }

        mark.addTo(mapContainer)
      })
      console.log(`There are ${count} charing atm :D`)
    }
  },
  mounted () {
    this.setupLeafletMap()
  }
}
</script>

<style scoped lang="scss">
.map {
  width: 25rem;
  height: 50vh;
}
</style>
