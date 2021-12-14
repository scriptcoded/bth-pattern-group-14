<template>
  <div>
    <h2 class="history__title">
      Unpaid invoices
    </h2>

    <div v-if="historyOnlyUnpaid.length > 0">
      <InvoiceCard
        v-for="item in historyOnlyUnpaid"
        :key="item.id"
        :amount="item.amount"
        :date="item.dateStart"
        :paid="item.paid"
        :invoice-link="item.invoiceLink"
      />
    </div>

    <HistoryCard
      v-else
      class="history__empty-state"
    >
      You're all caught up! 🎉
    </HistoryCard>

    <h2 class="history__title">
      History
    </h2>

    <div v-if="historyWithoutUnpaid.length > 0">
      <template
        v-for="item in historyWithoutUnpaid"
      >
        <TopupCard
          v-if="item.type === 'topup'"
          :key="item.id"
          :amount="item.amount"
          :date="item.dateStart"
        />
        <InvoiceCard
          v-else-if="item.type === 'invoice'"
          :key="item.id"
          :amount="item.amount"
          :date="item.dateStart"
          :paid="item.paid"
          :invoice-link="item.invoiceLink"
        />
        <RideCard
          v-else
          :key="item.id"
          :amount="item.amount"
        />
      </template>
    </div>
    <HistoryCard
      v-else
      class="history__empty-state"
    >
      There is no history, go ride! 🚗
    </HistoryCard>
  </div>
</template>

<script>
import HistoryCard from './HistoryCard'

import TopupCard from './TopupCard'
import InvoiceCard from './InvoiceCard'
import RideCard from './RideCard'

export default {
  components: {
    HistoryCard,
    TopupCard,
    InvoiceCard,
    RideCard
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    rides: {
      type: Array,
      required: true
    },
    payments: {
      type: Array,
      required: true
    }
  },
  computed: {
    history () {
      const rides = this.rides.map(ride => ({
        id: ride.id,
        dateStart: ride.startTime,
        dateEnd: ride.endTime,
        type: 'ride'
      }))

      const payments = this.payments.map(payment => ({
        id: payment.id,
        dateStart: new Date(payment.createdAt),
        dateEnd: null,
        type: payment.automatic ? 'invoice' : 'topup',
        amount: payment.amount,
        paid: payment.paid,
        invoiceLink: payment.invoiceLink
      }))

      const combined = [...rides, ...payments]

      return combined.slice().sort((a, b) => new Date(b.dateStart) - new Date(a.dateStart))
    },
    historyWithoutUnpaid () {
      return this.history.filter(item => item.type !== 'invoice' || item.paid)
    },
    historyOnlyUnpaid () {
      return this.history.filter(item => item.type === 'invoice' && !item.paid)
    }
  }
}
</script>

<style lang="scss" scoped>
.history__title {
  margin-top: 24px;
  margin-bottom: 16px;
}

.history__empty-state {
  text-align: center;
  color: #555;
  border-color: #777;
}
</style>
