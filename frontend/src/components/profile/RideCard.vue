<template>
  <HistoryCard
    title="Top-up"
    class="ride"
  >
    <div class="card__top">
      <h4 class="card__title">
        Ride
      </h4>
    </div>

    <!-- <div class="card__amount">
      {{ formatCurrency(amount) }}
    </div> -->
  </HistoryCard>
</template>

<script>
import HistoryCard from './HistoryCard'

export default {
  components: {
    HistoryCard
  },
  props: {
    amount: {
      type: Number,
      required: true
    }
  },
  methods: {
    formatCurrency (amount) {
      return (amount / 100).toFixed(2) + ' SEK'
    }
  }
}
</script>

<style lang="scss" scoped>
@import './historyCard.scss';

.card__title {
  border-color: #55c00d;
}

</style>
