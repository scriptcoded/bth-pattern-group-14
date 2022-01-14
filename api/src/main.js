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
const { startSchedules } = require('./schedule')

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
    url: config.redisURL
  })

  redisStore = new RedisStore({ client: redisClient })
}

app.use(cookieParser())
app.use(express.json({
  // Add raw body to request. Used for Stripe.
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))
app.set('trust proxy', 1)
app.use(session({
  secret: config.appSecret,
  store: redisStore,
  resave: true,
  saveUninitialized: true,
  cookie: {
    sameSite: config.isDev ? 'lax' : 'none',
    secure: !config.isDev,
    httpOnly: true
  }
}))

const corsOptions = {
  origin (origin, cb) {
    if (config.isDev) {
      cb(null, origin)
      return
    }

    cb(null, [config.frontendURL])
  },
  credentials: true
}

app.use(cors(corsOptions))

app.use(passport.initialize())
app.use(passport.session())

app.use(router)

app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`🚀 Server is running on port ${config.port}`)
})

startSchedules()
