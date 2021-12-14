<template>
  <HistoryCard
    title="Top-up"
  >
    <div class="card__top">
      <h4 class="card__title">
        Top-up
      </h4>

      <div class="card__date">
        {{ formatDate(date) }}
      </div>
    </div>

    <div class="card__amount">
      {{ formatCurrency(amount) }}
    </div>
  </HistoryCard>
</template>

<script>
import HistoryCard from './HistoryCard'

import { formatCurrency, formatDate } from '../../helpers'

export default {
  components: {
    HistoryCard
  },
  props: {
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  methods: {
    formatCurrency,
    formatDate
  }
}
</script>

<style lang="scss" scoped>
@import './historyCard.scss';

.card__title {
  border-color: #2f7de4;
}

</style>
