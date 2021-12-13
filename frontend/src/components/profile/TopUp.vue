<template>
  <div class=" bigboi">
    <!-- TODO(AreonL): Style error box -->
    <div v-if="error">
      {{ error }}
    </div>

    <!-- TODO(AreonL): Style form -->
    <form
      @submit.prevent="submit"
    >
      <label>
        <input
          v-model="form.amount"
          name="amount"
          type="radio"
          :value="1000"
          :disabled="loading"
        >
        10 kr
      </label>

      <label>
        <input
          v-model="form.amount"
          name="amount"
          type="radio"
          checked
          :value="2000"
          :disabled="loading"
        >
        20 kr
      </label>

      <label>
        <input
          v-model="form.amount"
          name="amount"
          type="radio"
          checked
          :value="3000"
          :disabled="loading"
        >
        30 kr
      </label>

      <label>
        <input
          v-model="form.amount"
          name="amount"
          type="radio"
          checked
          :value="5000"
          :disabled="loading"
        >
        50 kr
      </label>

      <label>
        <input
          v-model="form.amount"
          name="amount"
          type="radio"
          checked
          :value="10000"
          :disabled="loading"
        >
        100 kr
      </label>

      <button
        type="submit"
        :disabled="loading"
      >
        Top up
      </button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    loading: false,
    error: null,
    form: {
      amount: 3000
    }
  }),
  methods: {
    async submit () {
      this.error = null
      this.loading = true

      try {
        const { checkoutURL } = await this.$api.post('/payments/topup', {
          amount: this.form.amount
        })

        window.location.href = checkoutURL
      } catch (e) {
        this.error = e
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
