<template>
  <div>
    <h1> Charging Zones </h1>
    <div>
      <tr class="table-header">
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
        <th><button @click='deleteParkingZone(item.id)'>Delete</button></th>
      </tr>
      <button @click='createParkingZone()'>Create charging zone</button>
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
      const bikes = await this.$api.get('/charging-stations')
      console.log(bikes)
      this.arr = bikes
    },
    async disableBike (id, disabled) {
      const data = {
        disabled: !disabled
      }
      await this.$api.patch(`/bikes/${id}`, data)
      // console.log(result)
      // console.log(this.arr)
      this.arr.forEach((e, i) => {
        if (e.id === id) {
          e.disabled = !e.disabled
        }
        return e
      })
      // yanky solution to refresh page
      // this.$router.go()
    }
  },
  mounted () {
    this.test()
  }
}
</script>
