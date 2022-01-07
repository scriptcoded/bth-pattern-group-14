<template>
  <div class="home">
    <h1 class="home-title">
      Admin
    </h1>
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
      Parking zone
    </router-link>
    <router-link
      v-if="$auth.hasRole('admin')"
      :to="{ name: 'driving' }"
    >
      Driving Zone
    </router-link>
  </div>
</template>

<script>
export default {
}
</script>
