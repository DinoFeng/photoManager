const uuidV1 = require('uuid').v1
const { log4js } = require('../util/logger')
const logger = log4js.getLogger('app')

module.exports = (req, res, next) => {
  const id = uuidV1().replace(/-/g, '').toUpperCase()
  logger.info(`${id} ${req.url} Request...`)
  logger.time(id)
  req.requestId = req.requestId || id

  res.on('finish', function () {
    const status = res.statusCode
    logger.timeEnd(id)
    if (status === 200) {
      logger.info(`${id} ${req.url} ${status} Done...`)
    } else {
      logger.error(`${id} ${req.url} ${status} exception!!!`)
    }
  })
  next()
}
