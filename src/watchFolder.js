const chokidar = require('chokidar')
const _ = require('lodash')
const Rabbit = require('./util/rabbit')
const { log4js } = require('./util/logger')
const logger = log4js.getLogger('watchFolder')

  ;
(async () => {
  const config = require('./config.json')

  const exchange = 'watchImportFolder'
  const exchangeType = config.exchange[exchange]

  const channel = await new Rabbit({ address: 'amqp://localhost', hostName: 'watchFolder' })
    .then(rabbit =>
      rabbit.connection.createChannel()
        .then(async channel => {
          channel.assertExchange(exchange, exchangeType, { durable: true })
          return channel
        }),
    )

  const watchFolder = _.get(config, ['folder', 'watch']) || '.'
  logger.debug({ watchFolder })

  const watcher = chokidar.watch(watchFolder, { persistent: true, ignoreInitial: false })
  watcher
    .on('add', (path, state) => {
      logger.debug(`File ${path} has been added`)
      channel.publish(exchange, 'add', Buffer.from(JSON.stringify({ data: { path, state } })))
    })
    .on('change', path => {
      logger.info(`File ${path} has been changed`)
      channel.publish(exchange, 'change', Buffer.from(JSON.stringify({ data: path })))
    })
    .on('unlink', path => {
      logger.info(`File ${path} has been removed`)
      channel.publish(exchange, 'unlink', Buffer.from(JSON.stringify({ data: path })))
    })
    .on('error', error => logger.error(error))
})()
