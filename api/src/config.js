/* eslint-disable no-process-env */

/**
 * The global configuration object. Any configuration should be accessed through
 * this object, and not through direct reads from `process.env`.
 */
const config = {
  isDev: process.env.NODE_ENV === 'development',
  isSimulation: process.env.SIMULATION_MODE === 'true',

  port: process.env.PORT || 4000,

  appSecret: process.env.APP_SECRET,

  apiURL: (process.env.API_URL || '').replace(/\/$/, ''), // Remove trailing slash
  frontendURL: (process.env.FRONTEND_URL || '').replace(/\/$/, ''), // Remove trailing slash

  redisURL: process.env.REDIS_URL,

  passport: {
    githubClientID: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  }
}

module.exports.config = config

/**
 * Check that all required environment variables are set and print an error if
 * any are missing.
 */
module.exports.checkConfig = function checkConfig () {
  const missingVariables = []

  if (!config.appSecret) { missingVariables.push('APP_SECRET') }

  if (!config.apiURL) { missingVariables.push('API_URL') }
  if (!config.frontendURL) { missingVariables.push('FRONTEND_URL') }

  if (!config.passport.githubClientID) { missingVariables.push('GITHUB_CLIENT_ID') }
  if (!config.passport.githubClientSecret) { missingVariables.push('GITHUB_CLIENT_SECRET') }

  if (!config.stripe.secretKey) { missingVariables.push('STRIPE_SECRET_KEY') }
  if (!config.stripe.publishableKey) { missingVariables.push('STRIPE_PUBLISHABLE_KEY') }
  if (!config.stripe.webhookSecret) { missingVariables.push('STRIPE_WEBHOOK_SECRET') }

  // Display a nice list of missing environment variables
  if (missingVariables.length > 0) {
    const variablesList = '  - ' + missingVariables.join('\n  - ')

    console.error(`Missing required environment variables:\n${variablesList}`)
    process.exit(1)
  }
}
