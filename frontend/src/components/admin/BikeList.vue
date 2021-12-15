<template>
  <table>
    <tr class="table-header">
      <th> ID </th>
      <th> Active </th>
      <th> Battery </th>
      <th />
    </tr>
    <tr
      v-for="item in arr"
      :key="item.id"
      class="table-content"
    >
      <td> {{ item.id }} </td>
      <td v-if="item.disabled">
        No
      </td>
      <td v-else>
        Yes
      </td>
      <td> {{ item.battery }} </td>
      <td v-if="!item.disabled">
        <button @click="disableBike(item.id, item.disabled)">
          Disable bike
        </button>
      </td>
      <td v-else>
        <button
          class="red"
          @click="disableBike(item.id, item.disabled)"
        >
          Turn on bike
        </button>
      </td>
    </tr>
    <button @click="createBike()">
      Create bike
    </button>
  </table>
</template>

<script>

export default {
  data () {
    return {
      arr: null
    }
  },
  mounted () {
    this.test()
  },
  methods: {
    async test () {
      const bikes = await this.$api.get('/bikes')
      this.arr = bikes
    },
    async createBike () {
      const data = {
        latitude: 55.5605,
        longitude: 13.105
      }
      await this.$api.post('/bikes', data)
    },
    async disableBike (id, disabled) {
      const data = {
        disabled: !disabled
      }
      await this.$api.patch(`/bikes/${id}`, data)
      // console.log(result)
      // console.log(this.arr)
      // Find bike to modify and modify it
      const bike = this.arr.find(b => b.id === id)
      bike.disabled = !bike.disabled

      // Replace the original bike with the new one in the array and
      // *reassign the array*. This is important to trigger the
      // rectivity in Vue.
      this.arr = this.arr.map(b => b.id === id ? bike : b)
      // yanky solution to refresh page
      // this.$router.go()
    }
  }
}
</script>
