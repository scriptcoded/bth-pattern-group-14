import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import createRouter from './router'
import store from './store'

import AuthPlugin from './plugins/auth'

import '@/scss/styles.scss'
import ApiPlugin from './plugins/api'

Vue.config.productionTip = false

Vue.use(ApiPlugin)
Vue.use(AuthPlugin)

Vue.prototype.$auth.checkLogin()
  .then(() => {
    new Vue({
      router: createRouter(Vue.prototype.$auth),
      store,
      render: h => h(App)
    }).$mount('#app')
  })
  .catch(e => console.error('Failed initializing application:', e))
