<template>
  <div>
    <table>
      <tr class="table-header">
        <th> ID </th>
        <th> latitude start </th>
        <th> latitude end </th>
        <th> longitude start </th>
        <th> longitude end </th>
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
        <td class='update'><button @click='updateChargingZone(item.id)'>Update</button></td>
        <td class='delete'><button @click='deleteChargingZone(item.id)'>X</button></td>
      </tr>
    </table>
    <button @click='createChargingZone()'>Create charging zone</button>
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
    async getStations () {
      this.arr = await this.$api.get('/charging-stations')
    },
    onClick (id) {
      this.selectedItem = this.arr.filter(e => e.id === id)[0]
    },
    async updateChargingZone () {
      const id = this.selectedItem.id
      const data = {
        latitudeStart: this.selectedItem.latitudeStart,
        latitudeEnd: this.selectedItem.latitudeEnd,
        longitudeStart: this.selectedItem.longitudeStart,
        longitudeEnd: this.selectedItem.longitudeEnd
      }

      const res = await this.$api.patch(`/charging-stations/${id}`, data)
      this.arr = this.arr.filter(e => {
        if (e.id === id) {
          e.updatedAt = res.updatedAt
        }
        return e
      })
    },
    async createChargingZone () {
      const data = {
        latitudeStart: 55.5624,
        latitudeEnd: 55.5724,
        longitudeStart: 13.0370,
        longitudeEnd: 13.0470
      }
      const res = await this.$api.post('/charging-stations', data)
      this.arr.push(res)
    },
    async deleteChargingZone (id) {
      const yes = confirm('You sure you wanna delete this zone?')
      if (!yes) return
      await this.$api.delete(`/charging-stations/${id}`)
    }
  },
  mounted () {
    this.getStations()
  }
}
</script>
