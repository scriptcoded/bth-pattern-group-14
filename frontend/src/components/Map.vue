<template>
  <div>
    <div ref='map' class='map'></div>
    <div class='stuff'></div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerBlue from '../assets/blue.png'
import markerGray from '../assets/gray.png'
import markerGreen from '../assets/green.png'
import markerRed from '../assets/red.png'
import markerYellow from '../assets/yellow.png'
import config from '../config'
// import '../scss/map.scss'

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
    async setupLeafletMap () {
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
      const res = await fetch(`${config.apiURL}/bikes`)
      const arr = await res.json()
      // arr.forEach(e => arr.push(e))
      // const arr = [...Array(200)]
      // const maxX = (this.top - this.bottom).toFixed(4)
      // const maxY = (this.right - this.left).toFixed(4)

      /**
       * Spew out markers randomly :D
       */
      let count = 0

      arr.forEach((e, i) => {
        // const X = (this.bottom[0] + Math.random() * maxX).toFixed(4)
        // const Y = (this.left[0] + Math.random() * maxY).toFixed(4)
        console.log(e)
        // Lat = Y, Long = X
        const position = [e.lat, e.long]
        const mark = L.marker(position, { icon: this.locationMarkerGray })
        let charge = false
        let name = ''
        typeof e.name === 'undefined' ? name = '' : name = e.name

        if (name) {
          mark.options.icon = this.locationMarkerYellow
        } else if ((position[0] >= this.bottom[0] && position[0] <= this.bottom[0] + 0.01) && (position[1] >= this.left[0] && position[1] <= this.left[0] + 0.01)) {
          mark.options.icon = this.locationMarkerGreen
          charge = true
          count++
        } else if (e.active) {
          mark.options.icon = this.locationMarkerBlue
        }

        // mark.on('click', this.onMarkClick)
        console.log(charge)
        charge ? mark.addTo(mapContainer).bindPopup(`
          <h1>Bike id:${e.id}</h1>
          <h2 class='dab'>Go away!</h2>
          <p>Im charging!</p>
        `)
          : e.active ? mark.addTo(mapContainer)
            .bindPopup(`
              <h1>Bike id:${e.id}</h1>
              <h2 class='dab'>Hello there ${e.user} ${e.name}</h2>
              <p>*insert starwars meme*</p>
            `)
            : mark.addTo(mapContainer)
              .bindPopup(`
                <h1>Bike id:${e.id}</h1>
                <h2>Not active</h2>
                <p>Please help me :<</p>
              `)
        // mark.addPopup(e)
      })
      console.log(`There are ${count} charing atm :D`)
    },
    onMarkClick (e) {
      // var popup = e.target.getPopup()

      // console.log(popup)
    }
  },
  mounted () {
    this.setupLeafletMap()
  }
}
</script>
