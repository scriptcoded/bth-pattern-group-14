import config from '../config'

class Api {
  constructor () {
    this.defaultOptions = {
      credentials: 'include'
    }
  }

  async request (path, options) {
    const res = await fetch(`${config.apiURL}${path}`, {
      ...this.defaultOptions,
      ...options
    })
    const { data, error } = await res.json()

    if (error) {
      throw new Error(`Fetching failed: ${JSON.stringify(error)}`)
    }

    return data
  }

  get (path, options) {
    return this.request(path, {
      ...options,
      method: 'GET'
    })
  }

  post (path, data, options) {
    return this.request(path, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  patch (path, data, options) {
    return this.request(path, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  delete (path, options) {
    return this.request(path, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

const ApiPlugin = {
  install (Vue, options) {
    Vue.prototype.$api = new Api()
  }
}

export default ApiPlugin
