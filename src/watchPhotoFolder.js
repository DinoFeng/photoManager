const chokidar = require('chokidar')
const _ = require('lodash')
const Rabbit = require('./util/rabbit')
const { log4js } = require('./util/logger')
const logger = log4js.getLogger('watchPhotoFolder')
  // const logAdded = log4js.getLogger('photoFolder.Added')
  // const logChanged = log4js.getLogger('photoFolder.Changed')
  // const logRemoved = log4js.getLogger('photoFolder.Removed')

  ;
(async () => {
  const config = require('./config')

  const exchange = 'watchPhotoFolder'
  const exchangeType = config.exchange[exchange]

  const channel = await new Rabbit({ address: 'amqp://localhost', hostName: 'watchFolder' })
    .then(rabbit =>
      rabbit.connection.createChannel()
        .then(async channel => {
          channel.assertExchange(exchange, exchangeType || 'fanout', { durable: false })
          return channel
        }),
    )

  const watchFolder = _.get(config, ['folder', 'photo']) || '.'
  logger.info({ watchFolder })

  const watcher = chokidar.watch(watchFolder, {
    ignored: /^.*photoLib\.db(|-journal)$/,
    persistent: true,
    ignoreInitial: true,
  })
  watcher
    // .on('add', (path, state) => {
    //   logAdded.info(`Added File: ${path}`)
    //   channel.publish(exchange, 'add', Buffer.from(JSON.stringify({ data: { path, state } })))
    // })
    // .on('change', (path, state) => {
    //   logChanged.info(`Changed file: ${path}`)
    //   channel.publish(exchange, 'change', Buffer.from(JSON.stringify({ data: { path, state } })))
    // })
    // .on('unlink', (path, state) => {
    //   logRemoved.info(`Removed file: ${path}`)
    //   channel.publish(exchange, 'unlink', Buffer.from(JSON.stringify({ data: { path, state } })))
    // })
    .on('error', error => logger.error(error))
    .on('ready', () => logger.info('Initial scan complete. Ready for changes'))
    .on('all', (event, path, state) => {
      logger.info(`${event} file: ${path}`)
      channel.publish(exchange, '', Buffer.from(JSON.stringify({ data: { event, path, state } })))
    })
})()
