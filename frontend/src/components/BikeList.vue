<template>
  <div>
    <h1> Bikes </h1>
    <div>
      <tr class="table-header">
        <th> ID </th>
        <th> Active </th>
        <th> Battery </th>
        <th></th>
      </tr>
      <tr v-for="item in arr" :key="item.id" class="table-content">
        <th> {{ item.id }} </th>
        <th v-if="item.disabled"> No </th>
        <th v-else> Yes </th>
        <th> {{ item.battery }} </th>
        <th v-if="!item.disabled"> <button @click="disableBike(item.id, item.disabled)"> Disable bike </button></th>
        <th v-else> <button @click="disableBike(item.id, item.disabled)"> Turn on bike </button></th>
      </tr>
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
      const bikes = await this.$api.get('/bikes')
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
