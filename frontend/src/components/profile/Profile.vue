<template>
  <div class="profile-card">
    <h2 class="profile-card__name">
      {{ user.name }}
    </h2>

    <div class="profile-card__balance">
      Balance: <span class="profile-card__balance-amount">{{ formatCurrency(user.balance) }}</span>
    </div>

    <a
      v-if="$auth.hasRole('admin')"
      href="#"
      class="profile-card__generate-invoice"
      @click.prevent="generateInvoice"
    >{{ invoiceText }}</a>

    <h3 class="profile-card__topup-heading">
      Top up
    </h3>

    <div class="profile-card__topup">
      <button
        v-for="amount in topupAmounts"
        :key="amount"
        :disabled="topupLoading"
        class="profile-card__topup-button"
        :class="{
          'loading': topupLoading === amount
        }"
        @click="topup(amount)"
      >
        <span>
          {{ formatCurrency(amount, ' kr', 0) }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { formatCurrency } from '../../helpers'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    topupAmounts: [2000, 5000, 10000, 20000],
    topupLoading: null,
    invoiceLoading: false,
    invoiceGenerated: false
  }),
  computed: {
    invoiceText () {
      if (this.invoiceLoading) {
        return 'Generating invoice...'
      }

      if (this.invoiceGenerated) {
        return 'Invoice generated!'
      }

      return 'Generate invoice (admin only)'
    }
  },
  methods: {
    formatCurrency,

    async topup (amount) {
      if (this.topupLoading) { return }
      this.topupLoading = amount

      try {
        const { checkoutURL } = await this.$api.post('/payments/topup', {
          amount
        })

        window.location.href = checkoutURL
      } catch (e) {
        console.error('Error while topping up:', e)
        this.topupLoading = null
      }
    },
    async generateInvoice () {
      if (this.invoiceLoading || this.invoiceGenerated) { return }

      this.invoiceLoading = true

      await this.$api.post('/payments/invoice')

      this.invoiceLoading = false
      this.invoiceGenerated = true

      setTimeout(() => {
        this.invoiceGenerated = false
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-card {
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 16px;
  margin-bottom: 32px;
  border: 2px solid #000;
  border-radius: 8px;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: #fff;
}

.profile-card__name {
  font-size: 32px;
}

.profile-card__balance {
  font-size: 24px;
  font-weight: 400;
}

.profile-card__balance-amount {
  font-family: monospace;
  font-weight: 600;
}

.profile-card__generate-invoice {
  font-size: 16px;
  margin: 0;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: initial;
}

.profile-card__topup-heading {
  font-size: 24px;
  margin: 16px 0 8px 0;
  text-align: center;
}

.profile-card__topup {
  display: flex;
  justify-content: space-between;
}

.profile-card__topup-button {
  --color: #55c00d;

  position: relative;
  width: 120px;
  height: 60px;
  padding: 0;
  background-color: #fff;
  color: var(--color);
  border: 2px solid var(--color);
  border-radius: 5px;
  font-family: monospace;
  font-weight: 600;
}

.profile-card__topup-button span {
  font-size: 24px;
}

.profile-card__topup-button:hover:not([disabled]) {
  background-color: var(--color);
  color: #fff;
}

.profile-card__topup-button[disabled]:not(.loading) {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
