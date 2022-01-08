<template>
  <div>
    <table>
      <tr class='table-header'>
        <th> ID </th>
        <th> Lat-Start </th>
        <th> Lat-End </th>
        <th> Long-start </th>
        <th> Long-End </th>
        <th> Updated </th>
        <th> Update </th>
        <th> Delete </th>
      </tr>
      <tr v-for='item in arr' :key='item.id' class='table-content' @click='onClick(item.id)'>
        <td> {{ item.id }} </td>
        <td><input type="number" step="0.0001" v-model="item.latitudeStart"></td>
        <td><input type="number" step="0.0001" v-model="item.latitudeEnd"></td>
        <td><input type="number" step="0.0001" v-model="item.longitudeStart"></td>
        <td><input type="number" step="0.0001" v-model="item.longitudeEnd"></td>
        <td> {{ item.updatedAt }} </td>
        <td class='update'><button @click='updateParkingZone(item.id)'>Update</button></td>
        <td class='delete'><button @click='deleteParkingZone(item.id)'>X</button></td>
      </tr>
    <button @click='createParkingZone()'>Create parking zone</button>
    </table>
  </div>
</template>

<script>

export default {
  data () {
    return {
      arr: null,
      showUpdateForm: false,
      selectedItem: []
    }
  },
  methods: {
    async getParkingZones () {
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
      const res = await this.$api.post('/parking-zones', data)
      this.arr.push(res)
      // console.log(result)
      // console.log(this.arr)
      // yanky solution to refresh page
      // this.$router.go()
    },
    onClick (id) {
      this.selectedItem = this.arr.filter(e => e.id === id)[0]
    },
    async updateParkingZone () {
      const id = this.selectedItem.id
      const data = {
        latitudeStart: this.selectedItem.latitudeStart,
        latitudeEnd: this.selectedItem.latitudeEnd,
        longitudeStart: this.selectedItem.longitudeStart,
        longitudeEnd: this.selectedItem.longitudeEnd
      }
      const res = await this.$api.patch(`/parking-zones/${id}`, data)

      this.arr = this.arr.filter(e => {
        if (e.id === id) {
          e.updatedAt = res.updatedAt
        }
        return e
      })
    },
    async deleteParkingZone (id) {
      const yes = confirm('You sure you wanna delete this zone?')
      if (!yes) return
      await this.$api.delete(`/parking-zones/${id}`)

      this.arr = this.arr.filter(e => e.id !== id)
    }
  },
  mounted () {
    this.getParkingZones()
  }
}
</script>
