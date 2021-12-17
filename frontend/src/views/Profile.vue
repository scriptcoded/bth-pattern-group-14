<template>
  <div class="home profile-page">
    <template v-if="loaded">
      <h1 class="home-title profile">
        Profile
      </h1>

      <MessageBox
        v-if="$route.query.topup_result === 'success'"
        type="success"
        @dismiss="dismissTopupMessage"
      >
        <p>
          Account topped up!
        </p>
        <p>
          <small><i>Note that it might take a few seconds for your balance to update.</i></small>
        </p>
      </MessageBox>
      <MessageBox
        v-else-if="$route.query.topup_result === 'cancelled'"
        type="info"
        @dismiss="dismissTopupMessage"
      >
        Top up cancelled.
      </MessageBox>

      <Profile
        :user="user"
      />

      <History
        :user="user"
        :rides="rides"
        :payments="payments"
      />
    </template>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script>
import MessageBox from '@/components/MessageBox.vue'

import Profile from '@/components/profile/Profile.vue'
import History from '@/components/profile/History.vue'

export default {
  components: {
    MessageBox,
    Profile,
    History
  },
  data: () => ({
    loaded: false,
    user: null,
    rides: [],
    payments: []
  }),
  async mounted () {
    await this.loadUser()
    await this.loadRides()
    await this.loadPayments()

    this.loaded = true
  },
  methods: {
    async loadUser () {
      this.user = await this.$api.get('/auth/me')
    },
    async loadRides () {
      this.rides = await this.$api.get('/users/me/rides')
    },
    async loadPayments () {
      this.payments = await this.$api.get('/users/me/payments')
    },
    dismissTopupMessage () {
      this.$router.replace({
        ...this.$route,
        query: {
          ...this.$route.query || {},
          topup_result: undefined
        }
      })
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
