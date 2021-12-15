<template>
  <div class="home">
    <h1 class="profile">
      Top up account
    </h1>
    <TopUp
      :user="$auth.user"
    />
  </div>
</template>

<script>
import TopUp from '@/components/profile/TopUp.vue'

export default {
  components: {
    TopUp
  }
}
</script>
