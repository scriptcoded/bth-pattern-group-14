<template>
  <nav>
    <router-link :to="{name: 'home'}">Home</router-link>
    <router-link :to="{name: 'map'}">Map</router-link>
    <router-link :to="{name: 'about'}">About</router-link>
    <!-- EXTRA | Dropdown -->
    <!-- <div class="dropdown">
      <a class="dropbtn">Dropdown
        <i class="fa fa-caret-down"></i>
      </a>
      <div class="dropdown-content">
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
      </div>
    </div> -->
    <!-- <router-link :to="{name: 'admin'}">Admin</router-link> -->
    <router-link
      v-if="$auth.hasRole('admin')"
      :to="{ name: 'admin' }"
    >
      Admin
    </router-link>
    <router-link
      v-if="$auth.loggedIn()"
      :to="{ name: 'profile' }"
    >
      Profile
    </router-link>
    <a
      v-if="$auth.loggedIn()"
      href="#"
      @click.prevent="$auth.logout()"
    >
      Log out
    </a>
    <a
      v-else
      href="#"
      @click.prevent="$auth.login()"
    >
      Login
    </a>
  </nav>
</template>
