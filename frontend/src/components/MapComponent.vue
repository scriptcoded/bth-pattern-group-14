<template>
  <div>
    <div
      ref="mapcontainer"
      class="map"
    />
    <div class="stuff" />
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
// import '../scss/map.scss'

export default {
  data () {
    return {
      // center: [56.1803, 15.5906],
      intervalMap: null,
      mapContainer: null,
      clickedMarker: null,
      mapLayers: [],
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
  mounted () {
    this.setupMap()
    this.setupLeafletMap()
    // Interval fetch - set clear interval when refresh site / map
  },
  beforeDestroy () {
    clearInterval(this.intervalMap)
  },
  methods: {
    async setupMap () {
      this.mapContainer = L.map(this.$refs.mapcontainer).setView(this.center, 13)

      // Setup map
      L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
          attribution: 'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          accessToken: 'pk.eyJ1IjoiYXJlb25sIiwiYSI6ImNrdzFibmFndTE3N2gyeG5vcGlieXZsMWMifQ.S0ysiWIrgu-AbLrC_OAmKA'
        }
      ).addTo(this.mapContainer)

      this.mapLayers = L.layerGroup()

      if (!this.intervalMap) {
        this.intervalMap = setInterval(this.setupLeafletMap, 2000)
      } else {
        clearInterval(this.intervalMap)
      }
    },
    async resetMap () {
      this.mapLayers.eachLayer(layer => {
        this.mapContainer.removeLayer(layer)
      })
    },
    async setupLeafletMap () {
      const chargingstations = await this.$api.get('/charging-stations')
      const parkingzones = await this.$api.get('/parking-zones')
      const arr = await this.$api.get('/bikes')

      await this.resetMap()

      chargingstations.forEach((e, i) => {
        const recXY = [[e.latitudeStart, e.longitudeStart], [e.latitudeEnd, e.longitudeEnd]]
        const station = L.rectangle(recXY, { color: '#ff7800', weight: 1 }).addTo(this.mapContainer).bindPopup(`Charging-station ${i + 1}`)
        this.mapLayers.addLayer(station)
      })

      parkingzones.forEach((e, i) => {
        const recXY = [[e.latitudeStart, e.longitudeStart], [e.latitudeEnd, e.longitudeEnd]]
        const zone = L.rectangle(recXY, { color: '#00CAA8', weight: 1 }).addTo(this.mapContainer).bindPopup(`Parking-zone ${i + 1}`)
        this.mapLayers.addLayer(zone)
      })

      /**
       * Max cord maker
       */
      // arr.forEach(e => arr.push(e))
      // const arr = [...Array(200)]
      // const maxX = (this.top - this.bottom).toFixed(4)
      // const maxY = (this.right - this.left).toFixed(4)

      /**
       * Spew out markers randomly :D
       */
      arr.forEach((e, i) => {
        // const X = (this.bottom[0] + Math.random() * maxX).toFixed(4)
        // const Y = (this.left[0] + Math.random() * maxY).toFixed(4)
        // console.log(e)
        // Lat = Y, Long = X
        const position = [e.latitude, e.longitude]
        const mark = L.marker(position, { icon: this.locationMarkerGray })
        let charge = false
        let name = ''
        typeof e.name === 'undefined' ? name = '' : name = e.name

        if (name) {
          mark.options.icon = this.locationMarkerYellow
        } else if ((position[0] >= this.bottom[0] && position[0] <= this.bottom[0] + 0.01) && (position[1] >= this.left[0] && position[1] <= this.left[0] + 0.01)) {
          mark.options.icon = this.locationMarkerGreen
          charge = true
        } else if (!e.disabled) {
          mark.options.icon = this.locationMarkerBlue
        }

        // mark.on('click', this.onMarkClick)
        // console.log(charge)
        charge
          ? mark.bindPopup(`
          <h1>Bike id:${e.id}</h1>
          <h2 class="dab">Go away!</h2>
          <p>Im charging!</p>
        `)
          : !e.disabled
              ? mark.bindPopup(`
                <h1>Bike id:${e.id}</h1>
                <h2 class="dab">Hello there</h2>
                <p>*Available for ride*</p>
              `)
              : mark.bindPopup(`
                  <h1>Bike id:${e.id}</h1>
                  <h2>Not active</h2>
                  <p>Please help me :<</p>
                `)
        mark.addEventListener('click', () => {
          console.log("Hej", e.target.getPopup())
        })
        this.mapLayers.addLayer(mark)
      })
      // this.mapLayers.addTo(this.mapContainer) || EXTRA || Make popup stay if we click on it, aka remove from mapLayers
    },
    onMarkClick (e) {
      // console.log("Hej")
      // var popup = e.target.getPopup()

      // console.log(popup)
    }
  }
}
</script>
