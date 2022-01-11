<template>
  <div class="charing">
    <h1>Users</h1>
    <UsersList />
  </div>
</template>

<script>
import UsersList from '@/components/admin/UsersList.vue'

export default {
  components: {
    UsersList
  }
}
</script>
