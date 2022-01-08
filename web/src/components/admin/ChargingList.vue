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
      <tr
        v-for="item in arr"
        :key="item.id"
        class="table-content"
        @click="onClick(item.id)"
      >
        <td> {{ item.id }} </td>
        <td>
          <input
            v-model="item.latitudeStart"
            type="number"
            step="0.0001"
          >
        </td>
        <td>
          <input
            v-model="item.latitudeEnd"
            type="number"
            step="0.0001"
          >
        </td>
        <td>
          <input
            v-model="item.longitudeStart"
            type="number"
            step="0.0001"
          >
        </td>
        <td>
          <input
            v-model="item.longitudeEnd"
            type="number"
            step="0.0001"
          >
        </td>
        <td> {{ item.updatedAt }} </td>
        <td class="update">
          <button @click="updateChargingZone(item.id)">
            Update
          </button>
        </td>
        <td class="delete">
          <button @click="deleteChargingZone(item.id)">
            X
          </button>
        </td>
      </tr>
    </table>
    <button @click="createChargingZone()">
      Create charging zone
    </button>
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
  mounted () {
    this.getStations()
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
      // Find bike to modify and modify it
      const bike = this.arr.find(b => b.id === id)
      bike.updatedAt = res.updatedAt

      // Replace the original bike with the new one in the array and
      // *reassign the array*. This is important to trigger the
      // rectivity in Vue.
      this.arr = this.arr.map(b => b.id === id ? bike : b)
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
  }
}
</script>
