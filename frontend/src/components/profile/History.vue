<template>
  <div>
    <h2 class="history__title">
      Unpaid invoices
    </h2>

    <div v-if="historyOnlyUnpaid.length > 0">
      <InvoiceCard
        v-for="item in historyOnlyUnpaid"
        :key="item.id"
        :invoice-id="item.invoiceId"
        :amount="item.amount"
        :date="item.dateStart"
        :paid="item.paid"
        :invoice-link="item.invoiceLink"
        @set-paid="paid => setInvoicePaid(item.id, paid)"
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
          :key="`${item.id}_topup`"
          :amount="item.amount"
          :date="item.dateStart"
        />
        <InvoiceCard
          v-else-if="item.type === 'invoice'"
          :key="`${item.id}_invoice`"
          :invoice-id="item.invoiceId"
          :amount="item.amount"
          :date="item.dateStart"
          :paid="item.paid"
          :invoice-link="item.invoiceLink"
          @set-paid="paid => setInvoicePaid(item.id, paid)"
        />
        <RideCard
          v-else
          :key="`${item.id}_ride`"
          :amount="item.amount"
          :date-start="item.dateStart"
          :date-end="item.dateEnd"
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
      const rides = this.rides
        .filter(ride => ride.endTime) // Ride must have ended for it to show here
        .map(ride => ({
          id: ride.id,
          dateStart: new Date(ride.startTime),
          dateEnd: new Date(ride.endTime),
          amount: ride.chargedAmount,
          type: 'ride'
        }))

      const payments = this.payments.map(payment => ({
        id: payment.id,
        invoiceId: payment.invoiceId,
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
  },
  methods: {
    setInvoicePaid (id, paid) {
      this.$emit('set-invoice-paid', { id, paid })
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
