import { v1 as uuidV1 } from 'uuid'
import { logger } from '../util/logger'

const logMiddleware = async (req, res, next) => {
  const id = uuidV1()
  logger.time(id)
  // const { hostname, ip, method, url, userInfo } = req
  const { ip, method, originalUrl } = req
  // const { userNt } = userInfo || {}
  const action = `${ip} - ${method} ${originalUrl}`
  res.on('finish', function () {
    logger.timeEnd(id, null, `${action} ${res.statusCode} Done.`)
    // logger.debug(`${action} ${res.statusCode} Done.`)
  })
  next()
}

module.exports = logMiddleware
export default logMiddleware
