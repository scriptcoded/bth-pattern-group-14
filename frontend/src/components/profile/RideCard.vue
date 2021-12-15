<template>
  <HistoryCard
    title="Top-up"
    class="ride"
  >
    <div class="card__top">
      <h4 class="card__title">
        Ride
      </h4>

      <div class="card__date ride__time">
        <div>
          {{ formatDate(dateStart) }}
        </div>
        <div>
          <strong>
            {{ durationString }}
          </strong>
        </div>
      </div>
    </div>

    <div class="card__amount">
      {{ formatCurrency(negativeAmount, ' SEK', 2, 'Unknown price') }}
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
      type: [Number],
      default: null
    },
    dateStart: {
      type: Date,
      required: true
    },
    dateEnd: {
      type: Date,
      required: true
    }
  },
  computed: {
    durationMinutes () {
      return Math.ceil((this.dateEnd - this.dateStart) / 1000 / 60)
    },
    durationString () {
      if (this.durationMinutes === 1) {
        return `${this.durationMinutes} minute`
      } else {
        return `${this.durationMinutes} minutes`
      }
    },
    negativeAmount () {
      if (this.amount == null) {
        return this.amount
      }

      return -this.amount
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
  border-color: #55c00d;
}

.ride__time {
  text-align: right;
}

</style>
