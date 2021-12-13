const express = require('express')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const redis = require('redis')
const connectRedis = require('connect-redis')

// sockets and bike cache
const NodeCache = require('node-cache');
const bikeCache = new NodeCache();

const { bikeCacheMiddleware } = require('./middleware/bikeCacheMiddleware');
const { initCacheToPrisma }= require('./utils/cacheToPrisma');
const { initSocketServer } = require('./socket/socketServer');
// end sockets and bike cache

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
  saveUninitialized: false,
  cookie: {
    sameSite: config.isDev ? 'lax' : 'none',
    secure: !config.isDev,
    httpOnly: true
  }
}))

// TODO: This is just a temporary solution while in dev. It should not be used in production.
const corsOptions = {
  origin: (origin, cb) => cb(null, origin),
  credentials: true
}

app.use(cors(corsOptions))

app.use(passport.initialize())
app.use(passport.session())

// attaching bikecache to request object for access in controllers
app.use(bikeCacheMiddleware(bikeCache));

// // start the automatic updating of prisma database table bike from bikeCache
initCacheToPrisma(prisma, bikeCache);

app.use(router)

app.use(errorHandler)



const server = app.listen(config.port, () => {
  console.log(`🚀 Server is running on port ${config.port}`)
})

// init socketserver "on top" of http server 
const socketServer = initSocketServer(server, bikeCache);

// TODO: for debug now, maybe move to debug folder to start on debug mode?
setInterval(() => {
    server.getConnections((err, count) => {
        console.log('Connections:' + count);
    });
}, 1000);
