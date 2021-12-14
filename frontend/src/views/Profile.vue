<template>
  <div class="home profile-page">
    <h1 class="home-title profile">
      Profile
    </h1>
    <Profile
      :user="$auth.user"
    />

    <History
      :user="$auth.user"
      :rides="rides"
      :payments="payments"
    />
  </div>
</template>

<script>
import Profile from '@/components/profile/Profile.vue'
import History from '@/components/profile/History.vue'

export default {
  components: {
    Profile,
    History
  },
  data: () => ({
    rides: [],
    payments: []
  }),
  async mounted () {
    await this.loadRides()
    await this.loadPayments()
  },
  methods: {
    async loadRides () {
      this.rides = await this.$api.get('/users/me/rides')
    },
    async loadPayments () {
      this.payments = await this.$api.get('/users/me/payments')
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
}
</style>
