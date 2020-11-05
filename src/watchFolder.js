const chokidar = require('chokidar')
const _ = require('lodash')
const { log4js } = require('./util/logger')
const logger = log4js.getLogger('wathFolder')
logger.
  ;
(async () => {
  const config = require('./config.json')
  const watchFolder = _.get(config, ['folder', 'watch']) || '.'
  logger.debug({ watchFolder })

  const watcher = chokidar.watch(watchFolder, { persistent: true })
  watcher
    .on('add', path => log(`File ${path} has been added`))
    .on('error', error => logger.error(error))
})()
