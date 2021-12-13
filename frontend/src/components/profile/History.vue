<template>
  <div class="history">
    <div v-for="item in user" :key="item.id" class="stuffi"> <!-- Change id to type -->
      <div v-if="item.disabled" class="ride-history"> <!--Change logic to match "history" -->
        <div class="left">
          <p>Datum: {{changeDate(item.createdAt)}}</p> <!-- Change argument -->
          <p>Start: {{changeTime(item.createdAt)}}</p> <!-- Change argument -->
          <p>End:   {{changeTime(item.updatedAt)}}</p> <!-- Change argument -->
          <p>ID:    {{item.id}}</p>
        </div>
        <div class="right">
          <p>Pris:   {{item.id}}</p> <!-- Change variable -->
          <p>Rabatt: {{item.id}}</p> <!-- Change variable -->
          <p>Summa:  {{item.id}}</p> <!-- Change variable -->
        </div>
      </div>
      <div v-else-if="!item.disabled" class="faktura"> <!-- Change logic to match "Add to balance" -->
        <div class="left">
          <p>Inlagd balans: {{item.id}}</p> <!-- Change variable -->
          <p>ID: {{item.id}}</p>
        </div>
        <div class="right">
          <p>Datum: {{changeDate(item.createdAt)}}</p> <!-- Change argument -->
          <p>Tid: {{changeTime(item.updatedAt)}}</p> <!-- Change argument -->
        </div>
      </div>
      <div v-else class="faktura">
        <div class="left">
          <p>Faktura: {{item.id}}</p> <!-- Change variable -->
          <p>ID: {{item.id}}</p>
          <p>Betald: {{item.disabled ? "Ja" : "Nej"}}</p> <!-- Change variable -->
        </div>
        <div class="right">
          <p>Datum utskick: {{changeDate(item.createdAt)}}</p> <!-- Change argument -->
          <p v-if="item.disabled">Datum betald: {{changeDate(item.updatedAt)}}</p> <!-- Change argument && change if statement's variable-->
          <p>Bästföre datum: {{changeDate(item.createdAt)}}</p> <!-- Change argument -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      user: {},
      history: []
    }
  },
  methods: {
    async userInfo () {
      const user = await this.$api.get('/bikes')
      this.user = user
    },
    changeTime (time) {
      const actualDate = time.split('T')
      return actualDate[1].substring(0, 8)
    },
    changeDate (time) {
      const actualDate = time.split('T')
      return actualDate[0]
    }
  },
  mounted () {
    this.userInfo()
  }
}
</script>
