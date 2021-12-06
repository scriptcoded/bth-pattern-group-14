import config from '../config'

class Auth {
  constructor (api) {
    this.api = api
    this.user = null
  }

  login (provider = 'github') {
    window.location.href = `${config.apiURL}/auth/${provider}`
  }

  logout () {
    // TODO: Implement
  }

  async checkLogin () {
    try {
      this.user = await this.api.get('/auth/me')
    } catch (e) {
      // Silently dump error
      console.info('Auth failed:', e)
    }
  }

  loggedIn () {
    return !!this.user
  }

  hasRole (role) {
    return this.loggedIn() && this.user.role.toUpperCase() === role.toUpperCase()
  }
}

const AuthPlugin = {
  install (Vue, options) {
    Vue.prototype.$auth = new Auth(Vue.prototype.$api)
  }
}

export default AuthPlugin
