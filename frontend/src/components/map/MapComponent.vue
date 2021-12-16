<template>
  <div>
    <div
      ref="mapcontainer"
      class="map"
    />
    <RentedBike
      :started="startedRide"
      :selected="selectedBike"
      @clicked="resetMap"
      @inter="resetInterval"
    />
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerBlue from '@/assets/blue.png'
import markerGray from '@/assets/gray.png'
import markerGreen from '@/assets/green.png'
import markerRed from '@/assets/red.png'
import markerYellow from '@/assets/yellow.png'
import RentedBike from '@/components/map/RentedBike.vue'

// import '../scss/map.scss'

export default {
  components: {
    RentedBike
  },
  data () {
    return {
      // center: [56.1803, 15.5906],
      chargingPosition: [],
      parkingPosition: [],
      startedRide: false,
      selectedBike: null,
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
  async mounted () {
    this.setupMap()
    await this.setupZones()
    this.setupLeafletMap()
  },
  beforeDestroy () {
    clearInterval(this.intervalMap)
  },
  methods: {
    // async startRide (id, lat, long) {
    //   const data = {
    //     id: id,
    //     latitude: lat,
    //     longitude: long
    //   }
    //   await this.$api.post(`/bikes/${id}/start`, data)
    //   // fix if fail response
    //   this.startedRide = true
    //   this.resetMap()
    //   clearInterval(this.intervalMap)
    //   this.intervalMap = setInterval(this.rentedBikeUpdate, 2000, id)
    // },
    // async endRide (id) {
    //   await this.$api.post(`/bikes/${id}/end`)
    //   this.startedRide = false
    //   this.resetMap()
    //   clearInterval(this.intervalMap)
    //   this.intervalMap = setInterval(this.setupLeafletMap, 2000)
    // },
    checkZone (bikePosition, disabled) {
      /**
       * BP[0] = Latitude
       * BP[1] = Long
       * P[0] = latitudeStart
       * P[1] = longitudeStart
       * P[2] = latitudeEnd
       * P[3] = longitudeEnd
       */
      if (disabled) {
        return [this.locationMarkerGray, false]
      }

      const marker = [this.locationMarkerBlue, false]
      this.chargingPosition.forEach((p, i) => {
        if ((bikePosition[0] >= p[0] && bikePosition[0] <= p[2]) && (bikePosition[1] >= p[1] && bikePosition[1] <= p[3])) {
          marker[0] = this.locationMarkerGreen
          marker[1] = true
        }
      })
      this.parkingPosition.forEach((p, i) => {
        if ((bikePosition[0] >= p[0] && bikePosition[0] <= p[2]) && (bikePosition[1] >= p[1] && bikePosition[1] <= p[3])) {
          marker[0] = this.locationMarkerYellow
        }
      })
      return marker
    },
    async setupZones () {
      const chargingstations = await this.$api.get('/charging-stations')
      const parkingzones = await this.$api.get('/parking-zones')

      chargingstations.forEach((e, i) => {
        const position = [e.latitudeStart, e.longitudeStart, e.latitudeEnd, e.longitudeEnd]
        this.chargingPosition.push(position)
        const recXY = [[position[0], position[1]], [position[2], position[3]]]
        L.rectangle(recXY, { color: '#ff7800', weight: 1 }).addTo(this.mapContainer).bindPopup(`Charging-station ${i + 1}`)
        // this.mapLayers.addLayer(station)
      })

      parkingzones.forEach((e, i) => {
        const position = [e.latitudeStart, e.longitudeStart, e.latitudeEnd, e.longitudeEnd]
        this.parkingPosition.push(position)
        const recXY = [[position[0], position[1]], [position[2], position[3]]]
        L.rectangle(recXY, { color: '#00CAA8', weight: 1 }).addTo(this.mapContainer).bindPopup(`Parking-zone ${i + 1}`)
        // this.mapLayers.addLayer(zone)
      })
    },
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

      this.markerLayers = L.layerGroup()

      if (!this.intervalMap) {
        this.intervalMap = setInterval(this.setupLeafletMap, 2000)
      } else {
        clearInterval(this.intervalMap)
      }
    },
    async resetMap () {
      this.markerLayers.eachLayer(layer => {
        this.mapContainer.removeLayer(layer)
      })
    },
    async resetInterval (id = null, what = false) {
      clearInterval(this.intervalMap)
      if (what) {
        this.intervalMap = setInterval(this.rentedBikeUpdate, 2000, id)
      } else {
        this.intervalMap = setInterval(this.setupLeafletMap, 2000)
      }
    },
    async rentedBikeUpdate (id) {
      const rentedBike = await this.$api.get(`/bikes/${id}`)
      const position = [rentedBike.latitude, rentedBike.longitude]
      const mark = L.marker(position, { icon: this.locationMarkerRed })

      mark.bindPopup(`
          <h1>Bike id:${rentedBike.id}</h1>
          <h2 class="dab">Hey!</h2>
          <p>I'm riding along!</p>
        `).addTo(this.mapContainer)
    },
    async setupLeafletMap () {
      const arr = await this.$api.get('/bikes')

      await this.resetMap()

      /**
       * Max cord maker
       */
      // arr.forEach(e => arr.push(e))
      // const arr = [...Array(200)]
      // const maxX = (this.top - this.bottom).toFixed(4)
      // const maxY = (this.right - this.left).toFixed(4)

      /**
       * Remove active popup from changing on map
       */
      // console.log('Leta: ', arr, this.activePopup)
      const bike = arr.map(b => b.id === this.activePopup ? null : b).filter(n => n)
      /**
       * Spew out markers randomly :D
       */
      bike.forEach(async (e, i) => {
        // const X = (this.bottom[0] + Math.random() * maxX).toFixed(4)
        // const Y = (this.left[0] + Math.random() * maxY).toFixed(4)
        // console.log(e)
        // Lat = Y, Long = X
        // console.log('Bike: ', e)
        const position = [e.latitude, e.longitude]
        const mark = L.marker(position, { icon: this.locationMarkerGray })
        // console.log('%c Color' + i, 'background: #222; color: #bada55')
        const icon = this.checkZone(position, e.disabled)
        const charge = icon[1]

        mark.options.icon = icon[0]

        // mark.on('click', this.onMarkClick)
        // console.log(charge)
        charge
          ? mark.bindPopup(`
          <h1>Bike id:${e.id}</h1>
          <h2 class="dab">Get me when im full!</h2>
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
          console.log('Hej', mark.getPopup())
          this.selectedBike = {
            battery: e.battery,
            bikeId: e.id,
            latitude: e.latitude,
            longitude: e.longitude
          }
          // this.activePopup = e.id
          // const markerId = mark._leaflet_id
          // // Marker
          // // Find bk id ->marker.id where cykild.id = bk.id

          // // this.mapLayers.eachLayer(e => console.log(e))
          // // layer id === marker id (marker är en layer)
          // this.mapLayers.eachLayer(layer => {
          //   if (layer._leaflet_id === markerId) {
          //     console.log(layer._leaflet_id, markerId, layer)
          //     this.mapLayers.removeLayer(layer)
          //   }
          // })
        })
        this.markerLayers.addLayer(mark)
      })
      // || EXTRA || Make popup stay if we click on it, aka remove from markerLayers
      this.markerLayers.addTo(this.mapContainer)
    },
    onMarkClick (e) {
      // console.log("Hej")
      // var popup = e.target.getPopup()

      // console.log(popup)
    }
  }
}
</script>
