<template>
  <div>
    <table>
      <tr class="table-header">
        <th> ID </th>
        <th> latitude start </th>
        <th> latitude end </th>
        <th> longitude start </th>
        <th> longitude end </th>
        <th> Name </th>
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
        <td>
          <input
            v-model="item.name"
            type="string"
          >
        </td>
        <td> {{ item.updatedAt }} </td>
        <td class="update">
          <button @click="updateDrivingZone(item.id)">
            Update
          </button>
        </td>
        <td class="delete">
          <button @click="deleteDrivingZone(item.id)">
            X
          </button>
        </td>
      </tr>
    </table>
    <button @click="createDrivingZone()">
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
    this.getDrivingZones()
  },
  methods: {
    async getDrivingZones () {
      this.arr = await this.$api.get('/driving-zones')
    },
    onClick (id) {
      this.selectedItem = this.arr.filter(e => e.id === id)[0]
    },
    async updateDrivingZone () {
      const id = this.selectedItem.id
      const data = {
        latitudeStart: this.selectedItem.latitudeStart,
        latitudeEnd: this.selectedItem.latitudeEnd,
        longitudeStart: this.selectedItem.longitudeStart,
        longitudeEnd: this.selectedItem.longitudeEnd,
        name: this.selectedItem.name
      }

      const res = await this.$api.patch(`/driving-zones/${id}`, data)
      // Find bike to modify and modify it
      const bike = this.arr.find(b => b.id === id)
      bike.updatedAt = res.updatedAt

      // Replace the original bike with the new one in the array and
      // *reassign the array*. This is important to trigger the
      // rectivity in Vue.
      this.arr = this.arr.map(b => b.id === id ? bike : b)
    },
    async createDrivingZone () {
      const name = prompt('Where is this zone located?')
      if (!name) return
      const data = {
        latitudeStart: 55.5624,
        latitudeEnd: 55.5724,
        longitudeStart: 13.0370,
        longitudeEnd: 13.0470,
        name: name
      }
      const res = await this.$api.post('/driving-zones', data)
      this.arr.push(res)
    },
    async deleteDrivingZone (id) {
      const yes = confirm('You sure you wanna delete this zone?')
      if (!yes) return
      await this.$api.delete(`/driving-zones/${id}`)
    }
  }
}
</script>
