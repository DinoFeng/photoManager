// import morgan from 'morgan'
// import logs from './routes/logs'
import express from 'express'
import cookieParser from 'cookie-parser'
// import bodyParser from 'body-parser'
import { logger } from './util/logger'
import router from './router'
import middleware from './middleware'
import ConnectionPool from './orm/index'

const app = express()

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
  )
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DEconstE, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.send(200) /* 让options请求快速返回 */
  } else {
    next()
  }
})

// app.use(morgan('dev', { stream: loggerStream }))
// app.use(bodyParser.json({ limit: '10mb' }))
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// app.use(passport.initialize());
// app.use(passport.session());
Object.values(middleware).forEach((ware) => {
  app.use(ware)
})

app.locals.connectionPool = new ConnectionPool()
app.use((req, res, next) => {
  req.app = app
  req.getConnection = () => {
    const connectionPool = req.app.locals.connectionPool
    const client = connectionPool.getConnection()
    return client
  }
  next()
})
// app.use('/', express.static('public'))

Object.keys(router).forEach((k) => {
  app.use(`/${k}`, router[k])
})
const port = process.env.PORT || 3000
app.listen(port, function () {
  logger.info(`App listening on port ${port}!`)
})
module.exports = app
export default app
