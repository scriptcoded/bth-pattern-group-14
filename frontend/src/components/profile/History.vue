<template>
  <div class="history">
    <h1>Insert transaction | history</h1>
  </div>
</template>

<script>

export default {
  data () {
    return {
      user: [],
      history: []
    }
  },
  methods: {
    async userInfo () {
      const user = await this.$api.get('/bikes')
      this.user = user
    }
  },
  mounted () {
    this.userInfo()
  }
}
</script>
