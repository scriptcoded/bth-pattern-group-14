<template>
  <div class='bigboi'>
    <h2 class='username'>{{ user.name }}</h2>
    <h2 class='balance'>Balance: {{ user.balance }} kr</h2>
    <h2 v-if="user.balance > 0" class='canRide'>Can ride</h2>
    <h2 v-else class='canNotRide'>Can not ride</h2>
  </div>
</template>

<script>

export default {
  props: {
    user: Object
  }
}
</script>
