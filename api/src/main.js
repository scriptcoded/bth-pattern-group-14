const express = require('express')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const redis = require('redis')
const connectRedis = require('connect-redis')

const { router } = require('./router')
const { errorHandler } = require('./utils/express')
const { config, checkConfig } = require('./config')
const { prisma } = require('./utils/prisma')
const passportSerializers = require('./passport/serializers')
const { githubStrategy } = require('./passport/github.stragegy')

checkConfig()

passport.serializeUser(passportSerializers.serializeUser)
passport.deserializeUser(passportSerializers.deserializeUser)
passport.use(githubStrategy)

const app = express()

app.request.db = prisma

let redisStore
if (config.redisURL) {
  const RedisStore = connectRedis(session)

  // Configure redis client
  const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
  })

  redisStore = new RedisStore({ client: redisClient })
}

app.use(cookieParser())
app.use(express.json())
app.use(session({
  secret: config.appSecret,
  store: redisStore,
  resave: false,
  saveUninitialized: false
}))
app.use(cors())

app.use(passport.initialize())
app.use(passport.session())

app.use(router)

app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`🚀 Server is running on port ${config.port}`)
})
