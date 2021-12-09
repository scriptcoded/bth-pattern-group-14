<template>
  <div class="parking">
    <h1>Parking Zones</h1>
    <ParkingList />
  </div>
</template>

<script>
import ParkingList from '@/components/admin/ParkingList.vue'

export default {
  components: {
    ParkingList
  }
}
</script>
