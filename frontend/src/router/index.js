import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Map from '../views/Map.vue'
import Admin from '../views/Admin.vue'
import Profile from '../views/Profile.vue'
import TopUp from '../views/TopUp.vue'
import Bike from '../views/Bike.vue'
import Parking from '../views/Parking.vue'
import Charging from '../views/Charging.vue'
import { authGuard } from '../guards/auth'

Vue.use(VueRouter)

export default (auth) => {
  const routes = [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/map',
      name: 'map',
      component: Map
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: {
        auth: 'admin'
      }
    },
    {
      path: '/bikes',
      name: 'bike',
      component: Bike,
      meta: {
        auth: 'admin'
      }
    },
    {
      path: '/charging',
      name: 'charging',
      component: Charging,
      meta: {
        auth: 'admin'
      }
    },
    {
      path: '/parking',
      name: 'parking',
      component: Parking,
      meta: {
        auth: 'admin'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        auth: true
      }
    },
    {
      path: '/profile/topup',
      name: 'topup',
      component: TopUp,
      meta: {
        auth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  ]

  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })

  router.beforeEach(authGuard(auth))

  return router
}
