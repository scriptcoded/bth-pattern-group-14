<template>
  <div>
    <div v-if="!selected.available && (!$auth.hasRole('admin') || isAdmin)">
      <button @click="endRide(selected.bikeId)">
        End ride
      </button>
    </div>
    <!--
      user should be able to get button if not started
      if admin, don't show started rides
      if admin, show non started rides
     -->
    <div v-if="selected && selected.available">
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

export default {
  props: {
    started: Boolean,
    selected: {
      type: Object,
      default () {
        return {}
      },
      required: false
    },
    isAdmin: Boolean
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
      this.$emit('toggle-started-ride')
      this.$emit('resetmap')
      this.$emit('inter', id, true)
    },
    async endRide (id) {
      await this.$api.post(`/bikes/${id}/end`)
      this.$emit('toggle-started-ride')
      this.$emit('resetmap')
      this.$emit('inter', id, false)
    }
  }
}
</script>
