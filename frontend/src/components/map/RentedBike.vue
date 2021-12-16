<template>
  <div>
    <div v-if="startedRide">
      <button @click="endRide(selected.bikeId)">
        End ride
      </button>
    </div>
    <div v-if="selected && !startedRide">
      <p>
        Battery Level: {{ selected.battery }}%
      </p>
      <button @click="startRide(selected.bikeId, selected.latitude, selected.longitude)">
        Start ride
      </button>
    </div>
  </div>
</template>

<script>
// import { resetInterval } from '../../mapUtils.js'

export default {
  props: {
    started: Boolean,
    selected: {
      type: Object,
      default () {
        return {}
      },
      required: false
    }
  },
  data () {
    return {
      // center: [56.1803, 15.5906],
      startedRide: this.started
      // selectedBike: null
    }
  },
  methods: {
    async startRide (id, lat, long) {
      const data = {
        id: id,
        latitude: lat,
        longitude: long
      }
      await this.$api.post(`/bikes/${id}/start`, data)
      // fix if fail response
      this.startedRide = true
      this.$emit('clicked')
      this.$emit('inter', id, true)
      // clearInterval(this.intervalMap)
      // this.intervalMap = setInterval(this.rentedBikeUpdate, 2000, id)
    },
    async endRide (id) {
      await this.$api.post(`/bikes/${id}/end`)
      this.startedRide = false
      this.$emit('clicked')
      this.$emit('inter', id, false)
      // this.resetMap()
      // resetInterval()
      // clearInterval(this.intervalMap)
      // this.intervalMap = setInterval(this.setupLeafletMap, 2000)
    }
  }
}
</script>
