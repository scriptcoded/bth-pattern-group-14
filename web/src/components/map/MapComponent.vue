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
      markers: L.markerClusterGroup(),
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
      this.intervalMap = setInterval(this.setupLeafletMap, 2000)
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
      this.intervalMap = setInterval(this.rentedBikeUpdate, 2000, bikeId)
      return true
    },
    getPopupText (charge, bike) {
      if (charge) {
        return `<h1>Bike id:${bike.id}</h1>
          <h2 class="dab">Get me when im full!</h2>
          <p>Im charging!</p>`
      } else if (bike.disabled) {
        return `<h1>Bike id:${bike.id}</h1>
          <h2>Disabled</h2>
          <p>Bike is currently disabled</p>`
      } else if (bike.available) {
        return `<h1>Bike id:${bike.id}</h1>
          <h2>Available</h2>
          <p>Bike is currently available</p>`
      } else {
        return `<h1>Bike id:${bike.id}</h1>
          <h2 class="dab">Already taken</h2>
          <p>Riding</p>`
      }
    },
    /**
     * Toggels startedRide variable between true or false
     * Makse sure the start / end ride button changes accordingly
     * @returns {boolean} this.startedRide reversed
     */
    toggleStartedRide () {
      this.startedRide = !this.startedRide
    },
    checkIcon (bike) {
      /**
       * BP[0] = Latitude
       * BP[1] = Long
       * P[0] = latitudeStart
       * P[1] = longitudeStart
       * P[2] = latitudeEnd
       * P[3] = longitudeEnd
       */
      if (bike.disabled) {
        return [this.locationMarkerRed, false]
      }

      const marker = [this.locationMarkerBlue, false]
      // this.parkingPosition
      this.parkingPosition.forEach((p, i) => {
        let latitudeStart = p[0]
        let longitudeStart = p[1]
        let latitudeEnd = p[2]
        let longitudeEnd = p[3]
        if (latitudeStart > latitudeEnd) {
          latitudeStart = p[2]
          latitudeEnd = p[0]
        }
        if (longitudeStart > longitudeEnd) {
          longitudeStart = p[3]
          longitudeEnd = p[1]
        }
        if ((bike.latitude >= latitudeStart && bike.latitude <= latitudeEnd) && (bike.longitude >= longitudeStart && bike.longitude <= longitudeEnd)) {
          marker[0] = this.locationMarkerOrange
        }
      })
      this.chargingPosition.forEach((p, i) => {
        let latitudeStart = p[0]
        let longitudeStart = p[1]
        let latitudeEnd = p[2]
        let longitudeEnd = p[3]
        if (latitudeStart > latitudeEnd) {
          latitudeStart = p[2]
          latitudeEnd = p[0]
        }
        if (longitudeStart > longitudeEnd) {
          longitudeStart = p[3]
          longitudeEnd = p[1]
        }
        if ((bike.latitude >= latitudeStart && bike.latitude <= latitudeEnd) && (bike.longitude >= longitudeStart && bike.longitude <= longitudeEnd)) {
          marker[0] = this.locationMarkerPurple
          marker[1] = true
        }
      })

      if (bike.battery < 40 && marker[0] === this.locationMarkerBlue) {
        marker[0] = this.locationMarkerYellow
      }

      if (!bike.available) {
        marker[0] = this.locationMarkerGreen
        marker[1] = false
      }

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
      // this.bikesOnMap.push(rentedBike)
      // this.markers.addLayer(mark)
      // this.markerLayers.addLayer(this.markers)

      // this.markerLayers.addTo(this.mapContainer)
      // console.log(this.markerLayers)
      this.markerLayers.eachLayer(layer => {
        this.mapContainer.removeLayer(layer)
      })
      this.markers.eachLayer(layer => {
        this.markers.removeLayer(layer)
      })
      this.markerArray = []
      this.bikesOnMap = []
      // console.log('bikesOnMap', this.bikesOnMap.length)
      // console.log('markerLayers', this.markerLayers.length)
      // console.log('mapContainer', this.mapContainer.length)
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
        this.intervalMap = setInterval(this.rentedBikeUpdate, 2000, id)
      } else {
        this.setupLeafletMap()
        this.intervalMap = setInterval(this.setupLeafletMap, 2000)
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
      const bikesOnMapIds = this.bikesOnMap.map(bike => bike.id)

      if (!bikesOnMapIds.includes(rentedBike.id)) {
        this.bikesOnMap.push(rentedBike)
        this.markers = L.markerClusterGroup()
        this.markers.addLayer(mark)
        // this.markerLayers.addLayer(this.markers)

        this.markers.addTo(this.mapContainer)
      }

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
      // console.log(bikes)
      const bikesOnMapIds = this.bikesOnMap.map(bike => bike.id)
      // const bikesOnMapUpdated = this.bikesOnMap.map(bike => bike.id)
      // const bikesAvailable = bikes.map
      const bikeIds = bikes.map(bike => bike.id)

      const removedBikes = this.bikesOnMap.filter(bike => !bikeIds.includes(bike.id))
      const addedBikes = bikes.filter(bike => !bikesOnMapIds.includes(bike.id) && this.markerArray)
      const updatedBikes = bikes.filter(bike => {
        if (!bikesOnMapIds.includes(bike.id)) {
          return false
        }
        const mapBike = this.bikesOnMap.find(b => b.id === bike.id)
        // console.log(JSON.stringify(mapBike), JSON.stringify(bike), JSON.stringify(mapBike) !== JSON.stringify(bike))
        return JSON.stringify(mapBike) !== JSON.stringify(bike)
      })
      // console.log('removed', removedBikes)
      // console.log('added', addedBikes)
      // console.log('updated', updatedBikes)
      // console.log(this.markerArray)

      // await this.resetMap()

      removedBikes.forEach(async (bike) => {
        const marker = this.markerArray.find(marker => marker.bikeId === bike.id)
        this.markers.removeLayer(marker.mark)
        this.mapContainer.removeLayer(marker.mark)
        this.markerArray = this.markerArray.filter(marker => marker.bikeId !== bike.id)
      })

      updatedBikes.forEach((bike, i) => {
        const position = [bike.latitude, bike.longitude]
        const marker = this.markerArray.find(marker => marker.bikeId === bike.id)
        marker.mark.setLatLng(position)
        console.log('lol')
        const icon = this.checkIcon(bike)
        const text = this.getPopupText(icon[1], bike)
        console.log(icon)
        marker.mark.setIcon(icon[0])
        marker.mark._popup.setContent(text)
      })

      this.bikesOnMap = bikes

      // this.bikesOnMap = filter

      // this.markerArray.forEach(e => {

      // })
      // this.markerLayers.eachLayer(layer => {
      //   this.mapContainer.removeLayer(layer)
      // })

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
      // const markers = L.markerClusterGroup()
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
        const position = [bike.latitude, bike.longitude]
        const mark = L.marker(position, { icon: this.locationMarkerGray })
        // console.log('%c Color' + i, 'background: #222; color: #bada55')
        const icon = this.checkIcon(bike)
        // const charge = icon[1]

        mark.setIcon(icon[0])

        if (bike.battery < 40 && icon[0] === this.locationMarkerBlue) {
          mark.setIcon(this.locationMarkerYellow)
        }
        // mark.on('click', this.onMarkClick)
        // console.log(charge)
        // console.log(bike)
        // if (bike.available) {
        //   const available = 'available for ride!'
        // }

        const text = await this.getPopupText(icon[1], bike)

        mark.bindPopup(text)

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
        this.markers.addLayer(mark)
        this.markerLayers.addLayer(this.markers)
        this.markerArray.push({ bikeId: bike.id, mark: mark })
        // this.bikesOnMap.push(bike)
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
