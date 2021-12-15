<template>
  <HistoryCard
    title="Top-up"
    class="invoice"
    :class="{
      'invoice--unpaid': !paid
    }"
  >
    <div class="card__top">
      <div class="card__title-wrapper">
        <h4 class="card__title">
          Invoice
        </h4>

        <span
          v-if="!paid"
          class="card__addon-title card__addon-title--unpaid"
        >
          — Unpaid
        </span>
      </div>

      <div class="card__date">
        {{ formatDate(date) }}
      </div>
    </div>

    <div class="card__payment">
      <div class="card__amount">
        {{ formatCurrency(amount) }}
      </div>

      <div v-if="!paid">
        <a
          v-if="invoiceLink"
          class="button"
          :href="invoiceLink"
          target="_blank"
        >
          Pay now
        </a>
        <div
          v-else
          class="card__unpaid-no-link"
        >
          Check your email
        </div>
      </div>
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
    },
    paid: {
      type: Boolean,
      default: true
    },
    invoiceLink: {
      type: String,
      default: null
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

$unpaid-color: rgb(228, 78, 78);

.invoice--unpaid {
  margin: 16px -12px 24px -12px;
  border-color: $unpaid-color;
  box-shadow: 0 0 0 1px $unpaid-color,
              0 3px 8px 4px rgba($unpaid-color, 0.3);
}

.card__title {
  border-color: #951add;
}

.card__addon-title--unpaid {
  color: $unpaid-color;
  font-weight: 600;
  font-size: 20px;
}

.card__unpaid-no-link {
  font-weight: 700;
  text-decoration: underline;
}
</style>
