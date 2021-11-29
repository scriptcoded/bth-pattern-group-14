<template>
  <div>
    <header>
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
      </nav>
    </header>

    <router-view />

    <!-- <footer>Footer</footer> -->
  </div>
</template>
