<template>
  <div class="home">
    <h1 class="profile">Profile</h1>
    <Profile :user="$auth.user" />
    <History />
    <pre>{{ $auth.user }} aaa</pre>
  </div>
</template>

<script>
import Profile from '@/components/profile/Profile.vue'
import History from '@/components/profile/History.vue'

export default {
  components: {
    Profile,
    History
  }
}
</script>
