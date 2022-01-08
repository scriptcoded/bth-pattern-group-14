import * as dayjs from 'dayjs'

export function formatCurrency (amount, postfix = ' SEK', decimals = 2, fallback = '–') {
  if (amount == null) {
    return fallback
  }

  return (amount / 100).toFixed(decimals) + postfix
}

export function formatDate (date) {
  if (!date) { return '' }

  return dayjs(date).format('LLL')
}
