let config = {
  apiURL: 'http://localhost:4000'
}

// Production config
// https://github.com/codecentric/single-page-application-server#yaml-configuration
if (window && window.spaConfig && window.spaConfig) {
  config = {
    ...config,
    ...window.spaConfig
  }
}

export default config
