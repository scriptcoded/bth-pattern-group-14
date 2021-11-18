<template>
  <div>
    Navbar
    <router-link :to="{name: 'home'}">Go to Home</router-link>
    <router-link :to="{name: 'about'}">Go to About</router-link>
    <router-link :to="{name: 'map'}">Go to Map</router-link>

    <router-view />

    Footer
  </div>
</template>
