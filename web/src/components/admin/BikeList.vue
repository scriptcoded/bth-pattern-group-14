<template>
  <div>
    <p><b>Page:</b> {{ page + 1 }} / {{ pageCount }}</p>
    <button
      :disabled="page <= 0"
      @click="prevPage"
    >
      Previous
    </button>
    <button
      :disabled="page >= pageCount"
      @click="nextPage"
    >
      Next
    </button>

    <table>
      <tr class="table-header">
        <th> ID </th>
        <th> Active </th>
        <th> long </th>
        <th> lat </th>
        <th> Battery </th>
        <th> Update </th>
        <th />
      </tr>
      <tr
        v-for="item in shownArr"
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
        <td>
          <input
            v-model="item.longitude"
            type="number"
            step="0.0001"
          >
        </td>
        <td>
          <input
            v-model="item.latitude"
            type="number"
            step="0.0001"
          >
        </td>
        <td> {{ item.battery }} </td>
        <td
          v-if="!item.disabled"
          class="update"
        >
          <button @click="updateBike(item.id, item.longitude, item.latitude)">
            Update bike
          </button>
        </td>
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

    <p><b>Page:</b> {{ page + 1 }} / {{ pageCount }}</p>
    <button
      :disabled="page <= 0"
      @click="prevPage"
    >
      Previous
    </button>
    <button
      :disabled="page >= pageCount"
      @click="nextPage"
    >
      Next
    </button>
  </div>
</template>

<script>

export default {
  data: () => ({
    arr: [],
    page: 0,
    pageSize: 100
  }),
  computed: {
    pageCount () {
      return Math.ceil(this.arr.length / this.pageSize)
    },
    shownArr () {
      const start = this.page * this.pageSize
      const end = start + this.pageSize
      return this.arr.slice(start, end)
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
        latitude: 55.5605 + ((Math.random() * 100) / 10000),
        longitude: 13.105 + ((Math.random() * 100) / 10000)
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
    },
    async updateBike (id, long, lat) {
      const data = {
        latitude: lat,
        longitude: long
      }
      await this.$api.patch(`/bikes/${id}`, data)
    },
    prevPage () {
      if (this.page > 0) {
        this.page--
      }
    },
    nextPage () {
      if (this.page < this.pageCount - 1) {
        this.page++
      }
    }
  }
}
</script>
