<template>
  <div class="admin">
    <h1>Admin</h1>
    <router-link
      v-if="$auth.hasRole('admin')"
      :to="{ name: 'bike' }"
    >
      Bikes
    </router-link>
    <router-link
      v-if="$auth.hasRole('admin')"
      :to="{ name: 'charging' }"
    >
      Charging station
    </router-link>
    <router-link
      v-if="$auth.hasRole('admin')"
      :to="{ name: 'parking' }"
    >
      Parking station
    </router-link>
  </div>
</template>

<script>
export default {
}
</script>
