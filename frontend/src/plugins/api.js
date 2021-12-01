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

  async get (path, options) {
    return this.request(path, {
      ...options,
      method: 'GET'
    })
  }

  async post (path, data, options) {
    return this.request(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async patch (path, data, options) {
    return this.request(path, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  async delete (path, options) {
    return this.request(path, {
      ...options,
      method: 'DELETE'
    })
  }
}

const ApiPlugin = {
  install (Vue, options) {
    Vue.prototype.$api = new Api()
  }
}

export default ApiPlugin
