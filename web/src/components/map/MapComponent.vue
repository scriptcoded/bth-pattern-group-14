<template>
  <div>
    <div
      ref="mapcontainer"
      class="map"
    />
    <RentedBike
      :started="startedRide"
      :selected="selectedBike"
      @resetmap="resetMap"
      @toggle-started-ride="toggleStartedRide"
      @inter="resetInterval"
    />
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet.markercluster'
import markerBlue from '@/assets/blue.png'
import markerYellow from '@/assets/yellow3.png'
import markerGreen from '@/assets/green.png'
import markerGray from '@/assets/gray.png'
import markerPurple from '@/assets/purple.png'
import markerRed from '@/assets/red.png'
import markerOrange from '@/assets/orange.png'
import RentedBike from '@/components/map/RentedBike.vue'

// import '../scss/map.scss'

export default {
  components: {
    RentedBike
  },
  data () {
    return {
      // center: [56.1803, 15.5906],
      markerArray: [],
      bikesOnMap: [],
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
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, 0]
      }),
      locationMarkerPurple: L.icon({
        iconUrl: markerPurple,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, 0]
      }),
      locationMarkerRed: L.icon({
        iconUrl: markerRed,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, 0]
      }),
      locationMarkerOrange: L.icon({
        iconUrl: markerOrange,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, 0]
      }),
      locationMarkerGray: L.icon({
        iconUrl: markerGray,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, 0]
      }),
      locationMarkerYellow: L.icon({
        iconUrl: markerYellow,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, 0]
      })
    }
  },
  async mounted () {
    this.setupMap()
    await this.setupZones()
    const check = await this.getRide()
    if (!check) {
      this.setupLeafletMap()
      this.intervalMap = setInterval(this.setupLeafletMap, 5000)
    }
  },
  beforeDestroy () {
    clearInterval(this.intervalMap)
  },
  methods: {
    /**
    * This function checks if user is currently
    * riding a bike
    * @returns {boolean} resets interval
    */
    async getRide () {
      const rides = await this.$api.get('/users/me/rides')
      const bike = rides.find(i => !i.endTime)
      if (bike === undefined) { return false }
      const bikeId = bike.bikeId
      this.startedRide = true
      this.rentedBikeUpdate(bikeId)
      this.intervalMap = setInterval(this.rentedBikeUpdate, 5000, bikeId)
      return true
    },
    /**
     * Toggels startedRide variable between true or false
     * Makse sure the start / end ride button changes accordingly
     * @returns {boolean} this.startedRide reversed
     */
    toggleStartedRide () {
      this.startedRide = !this.startedRide
    },
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
        return [this.locationMarkerRed, false]
      }

      const marker = [this.locationMarkerBlue, false]
      // this.parkingPosition
      this.parkingPosition.forEach((p, i) => {
        if ((bikePosition[0] >= p[0] && bikePosition[0] <= p[2]) && (bikePosition[1] >= p[1] && bikePosition[1] <= p[3])) {
          marker[0] = this.locationMarkerOrange
        }
      })
      this.chargingPosition.forEach((p, i) => {
        if ((bikePosition[0] >= p[0] && bikePosition[0] <= p[2]) && (bikePosition[1] >= p[1] && bikePosition[1] <= p[3])) {
          marker[0] = this.locationMarkerPurple
          marker[1] = true
        }
      })
      return marker
    },

    /**
    * This function sets up all the zone
    * no @parameters in
    * @returns all zones
    */
    async setupZones () {
      const chargingstations = await this.$api.get('/charging-stations')
      const parkingzones = await this.$api.get('/parking-zones')
      const drivingzones = await this.$api.get('/driving-zones')

      drivingzones.forEach((e, i) => {
        const position = [e.latitudeStart, e.longitudeStart, e.latitudeEnd, e.longitudeEnd]
        const recXY = [[position[0], position[1]], [position[2], position[3]]]
        L.rectangle(recXY, { color: 'blue', weight: 1, fillOpacity: 0 }).addTo(this.mapContainer)
      })

      chargingstations.forEach((e, i) => {
        let position = [e.latitudeStart, e.longitudeStart, e.latitudeEnd, e.longitudeEnd]
        position = position.map(Number)
        this.chargingPosition.push(position)
        const recXY = [[position[0], position[1]], [position[2], position[3]]]
        L.rectangle(recXY, { color: '#ff7800', weight: 1 }).addTo(this.mapContainer).bindPopup(`Charging-station ${i + 1}`)
        // this.mapLayers.addLayer(station)
      })

      parkingzones.forEach((e, i) => {
        let position = [e.latitudeStart, e.longitudeStart, e.latitudeEnd, e.longitudeEnd]
        position = position.map(Number)
        this.parkingPosition.push(position)
        const recXY = [[position[0], position[1]], [position[2], position[3]]]
        L.rectangle(recXY, { color: '#00CAA8', weight: 1 }).addTo(this.mapContainer).bindPopup(`Parking-zone ${i + 1}`)
        // this.mapLayers.addLayer(zone)
      })
    },

    /**
    * This function sets up the map
    * no @parameters in
    * @returns the map
    */
    async setupMap () {
      this.mapContainer = L.map(this.$refs.mapcontainer).setView(this.center, 13)

      // Setup map
      L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
          attribution: 'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          zoomOffset: -1,
          tileSize: 512,
          accessToken: 'pk.eyJ1IjoiYXJlb25sIiwiYSI6ImNrdzFibmFndTE3N2gyeG5vcGlieXZsMWMifQ.S0ysiWIrgu-AbLrC_OAmKA'
        }
      ).addTo(this.mapContainer)

      this.markerLayers = L.layerGroup()

      // if (!this.intervalMap) {
      // this.intervalMap = setInterval(this.setupLeafletMap, 2000)
      // } else {
      //   clearInterval(this.intervalMap)
      // }
    },

    /**
    * This function resets the map
    * no @parameters in
    * @returns the resetted map
    */
    async resetMap () {
      // this.markerLayers.eachLayer(layer => {
      //   this.mapContainer.removeLayer(layer)
      // })
    },

    /**
    * This function resets the refresh interval
    * for bikes
    * @param {special id} id (default null)
    * @param {boolean} what (default false)
    * @returns resets interval
    */
    async resetInterval (id = null, what = false) {
      clearInterval(this.intervalMap)
      if (what) {
        this.rentedBikeUpdate(id)
        this.intervalMap = setInterval(this.rentedBikeUpdate, 5000, id)
      } else {
        this.setupLeafletMap()
        this.intervalMap = setInterval(this.setupLeafletMap, 5000)
      }
    },

    /**
    * If a bike is rented this function
    * will get that specific bike
    * @param {special id} id
    */
    async rentedBikeUpdate (id) {
      const rentedBike = await this.$api.get(`/bikes/${id}`)
      const position = [rentedBike.latitude, rentedBike.longitude]
      const mark = L.marker(position, { icon: this.locationMarkerGreen })

      mark.bindPopup(`
          <h1>Bike id:${rentedBike.id}</h1>
          <h2 class="dab">Hey!</h2>
          <p>I'm riding along!</p>
        `).addTo(this.markerLayers)
      this.markerLayers.addTo(this.mapContainer)

      this.selectedBike = {
        battery: rentedBike.battery,
        bikeId: rentedBike.id,
        latitude: rentedBike.latitude,
        longitude: rentedBike.longitude
      }
    },
    /**
    * This function sets up leafletmap
    */
    async setupLeafletMap () {
      // const bikesOnMap = [] // Lista med cyklar

      // async function update() {
      // const bikes = await getAllBikes()
      // const bikesOnMapIds = bikesOnMap.map(bike => bike.id)
      // const bikeIds = bikes.map(bike => bike.id)

      // const removedBikes = bikesOnMap.filter(bike => !bikeIds.includes(bike.id))
      // const addedBikes = bikes.filter(bike => !bikesOnMapIds.includes(bike.id))
      // const updatedBikes = bikes.filter(bike => bikesOnMapIds.includes(bike.id))

      // // TODO: Implement
      // }
      const bikes = await this.$api.get('/bikes')
      const bikesOnMapIds = this.bikesOnMap.map(bike => bike.id)
      const bikesOnMapUpdated = this.bikesOnMap.map(bike => bike.updatedAt)
      // const bikeIds = bikes.map(bike => bike.id)

      // const removedBikes = this.bikesOnMap.filter(bike => !bikeIds.includes(bike.id))
      const addedBikes = bikes.filter(bike => !bikesOnMapIds.includes(bike.id))
      const updatedBikes = bikes.filter(bike => !bikesOnMapUpdated.includes(bike.updatedAt))
      // console.log('removed', removedBikes)
      // console.log('added', addedBikes)
      // console.log('updated', updatedBikes)

      await this.resetMap()

      updatedBikes.forEach(async (bike, i) => {
        // console.log(bike)
        const position = [bike.latitude, bike.longitude]
        const marker = this.markerArray.find(marker => marker.bikeId === bike.id)
        // const newLatLng = new L.LatLng(position[0], position[1])
        marker.mark.setLatLng(position)
        // this.mapContainer.addTo(marker)
      })
      this.bikesOnMap = bikes

      // this.bikesOnMap = this.bikesOnMap.map(e => {
      //   updatedBikes.forEach(updated => {
      //     if (!updated.id.includes(e.id)) {
      //       return e
      //     }
      //   })
      // })

      // console.log(newArray)

      // this.bikesOnMap = this.bikesOnMap.filter(bike => bike.includes(updatedBikes[i]))

      // updated

      /**
       *
       * markerArray = [{
       *   bikeId: 'YMAL2',
       *   marker: markerObject
       * },
       * {
       *   bikeId: 'YMAL4',
       *   marker: markerObject
       * }
       * ]
       */

      /**
       * Remove active popup from changing on map
       */
      // console.log('Leta: ', arr, this.activePopup)
      // const bikesArray = bikes.map(b => b.id === this.activePopup ? null : b).filter(n => n)
      /**
       * Marker cluster group
       */
      const markers = L.markerClusterGroup()
      /**
       * Spew out markers randomly :D
       */
      addedBikes.forEach(async (bike, i) => {
        // const X = (this.bottom[0] + Math.random() * maxX).toFixed(4)
        // const Y = (this.left[0] + Math.random() * maxY).toFixed(4)
        // console.log(bike)
        // Lat = Y, Long = X
        // console.log('Bike: ', bike)
        // if (i % 2 == 0) {
        //   continue
        // }
        const position = [parseFloat(bike.latitude), parseFloat(bike.longitude)]
        const mark = L.marker(position, { icon: this.locationMarkerGray })
        // console.log('%c Color' + i, 'background: #222; color: #bada55')
        const icon = this.checkZone(position, bike.disabled)
        const charge = icon[1]

        mark.options.icon = icon[0]

        if (bike.battery < 40 && icon[0] === this.locationMarkerBlue) {
          mark.options.icon = this.locationMarkerYellow
        }
        // mark.on('click', this.onMarkClick)
        // console.log(charge)

        charge
          ? mark.bindPopup(`
          <h1>Bike id:${bike.id}</h1>
          <h2 class="dab">Get me when im full!</h2>
          <p>Im charging!</p>
        `) // Charging
          : !bike.disabled
              ? mark.bindPopup(`
                <h1>Bike id:${bike.id}</h1>
                <h2 class="dab">Hello there</h2>
                <p>*Available for ride*</p>
              `) // Not charging and not disabled
              : mark.bindPopup(`
                  <h1>Bike id:${bike.id}</h1>
                  <h2>Disabled</h2>
                  <p>Please help me :<</p>
                `) // Not charging and disabled

        mark.addEventListener('click', () => {
          this.selectedBike = {
            battery: bike.battery,
            bikeId: bike.id,
            latitude: bike.latitude,
            longitude: bike.longitude
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
        markers.addLayer(mark)
        this.markerLayers.addLayer(markers)
        this.markerArray.push({ bikeId: bike.id, mark: mark })
        this.bikesOnMap.push(bike)
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
