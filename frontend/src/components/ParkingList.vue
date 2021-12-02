<template>
  <div>
    <h1> Parking Zones </h1>
    <div>
      <tr class='table-header'>
        <th> ID </th>
        <th> latitude start </th>
        <th> latitude end </th>
        <th> longitude start </th>
        <th> longitude end </th>
        <th> Updated </th>
        <th></th>
      </tr>
      <tr v-for='item in arr' :key='item.id' class='table-content'>
        <th> {{ item.id }} </th>
        <th> {{ item.latitudeStart }} </th>
        <th> {{ item.latitudeEnd }} </th>
        <th> {{ item.longitudeStart }} </th>
        <th> {{ item.longitudeEnd }} </th>
        <th> {{ item.updatedAt }}</th>
        <th></th>
        <th><button @click='deleteParkingZone(item.id)'>Delete</button></th>
      </tr>
      <button @click='createParkingZone()'>Create parking zone</button>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      arr: null
    }
  },
  methods: {
    async test () {
      const bikes = await this.$api.get('/parking-zones')
      console.log(bikes)
      this.arr = bikes
    },
    async createParkingZone () {
      // bottom: [55.5524, 55.5624],
      // left: [13.0270, 13.0370],
      const data = {
        latitudeStart: 55.5524,
        latitudeEnd: 55.5624,
        longitudeStart: 13.0270,
        longitudeEnd: 13.0370
      }
      await this.$api.post('/parking-zones', data)
      // console.log(result)
      // console.log(this.arr)
      // yanky solution to refresh page
      // this.$router.go()
    },
    async deleteParkingZone (id) {
      console.log('delete')
      await this.$api.delete(`/parking-zones/${id}`)
    }
  },
  mounted () {
    this.test()
  }
}
</script>
