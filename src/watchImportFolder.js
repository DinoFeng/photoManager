const chokidar = require('chokidar')
const _ = require('lodash')
const Rabbit = require('./util/rabbit')
const { log4js } = require('./util/logger')
const logger = log4js.getLogger('importFolder.watch')
const logAdded = log4js.getLogger('importFolder.Added')
const logChanged = log4js.getLogger('importFolder.Changed')
const logRemoved = log4js.getLogger('importFolder.Removed')
  ;
(async () => {
  const config = require('./config')

  const exchange = 'watchImportFolder'
  const exchangeType = config.exchange[exchange]

  const channel = await new Rabbit({ address: 'amqp://localhost', hostName: 'watchFolder' })
    .then(rabbit =>
      rabbit.connection.createChannel()
        .then(async channel => {
          channel.assertExchange(exchange, exchangeType || 'fanout', { durable: false })
          return channel
        }),
    )

  const watchFolder = _.get(config, ['folder', 'import']) || '.'
  logger.debug({ watchFolder })

  const watcher = chokidar.watch(watchFolder, { persistent: true, ignoreInitial: false })
  watcher
    .on('add', (path, state) => {
      logAdded.info(`Added File: ${path}`)
      channel.publish(exchange, 'add', Buffer.from(JSON.stringify({ data: { path, state } })))
    })
    .on('change', path => {
      logChanged.debug(`Changed file: ${path}`)
      // channel.publish(exchange, 'change', Buffer.from(JSON.stringify({ data: path })))
    })
    .on('unlink', path => {
      logRemoved.debug(`Removed file: ${path}`)
      // channel.publish(exchange, 'unlink', Buffer.from(JSON.stringify({ data: path })))
    })
    .on('error', error => logger.error(error))
})()
