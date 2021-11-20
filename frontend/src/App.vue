<template>
  <div>
    <header>
      <span>Navbar</span>
      <nav>
        <router-link :to="{name: 'home'}">Go to Home</router-link>
        <router-link :to="{name: 'about'}">Go to About</router-link>
        <router-link :to="{name: 'map'}">Go to Map</router-link>
      </nav>
    </header>

    <router-view />

    <footer>Footer</footer>
  </div>
</template>
