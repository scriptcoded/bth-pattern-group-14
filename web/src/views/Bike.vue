<template>
  <div class="home">
    <h1 class="home-title">
      Bikes
    </h1>
    <BikeList />
  </div>
</template>

<script>
import BikeList from '@/components/admin/BikeList.vue'

export default {
  components: {
    BikeList
  }
}
</script>
