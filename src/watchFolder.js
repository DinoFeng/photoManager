const chokidar = require('chokidar')
const _ = require('lodash')
const { log4js } = require('./util/logger')
const Rabbit = require('./util/rabbit')
const logger = log4js.getLogger('watchFolder')

const exchange = 'watchFolderExchange'
  ;
(async () => {
  const channel = await new Rabbit({ address: 'amqp://localhost', hostName: 'watchFolder' })
    .then(rabbit =>
      rabbit.connection.createChannel()
        .then(async channel => {
          channel.assertExchange(exchange, 'fanout', { durable: true })
          return channel
        }),
    )

  const config = require('./config.json')
  const watchFolder = _.get(config, ['folder', 'watch']) || '.'
  logger.debug({ watchFolder })

  const watcher = chokidar.watch(watchFolder, { persistent: true })
  watcher
    .on('add', path => {
      logger.info(`File ${path} has been added`)
      channel.publish(exchange, '', Buffer.from(JSON.stringify({ data: path })))
    })
    .on('change', path => logger.info(`File ${path} has been changed`))
    .on('unlink', path => logger.info(`File ${path} has been removed`))
    .on('error', error => logger.error(error))
})()
