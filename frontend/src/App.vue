<template>
  <div class="all-seeing-odin">
    <header>
      <NavBar />
    </header>

    <router-view />

    <!-- <footer>Footer</footer> -->
  </div>
</template>

<script>
import NavBar from './components/NavBar'

export default {
  components: {
    NavBar
  }
}
</script>
