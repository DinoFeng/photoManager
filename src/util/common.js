import { logger } from './logger'
const NS_PER_SEC = 1e9
const MS_PER_SEC = 1e6

const wrapAsync = (func) => async (req, res, next) => {
  const begin = process.hrtime()
  let result = null
  const { ip, method, originalUrl } = req
  const action = `${ip} - ${method} ${originalUrl}`
  try {
    result = await func(req, res, next)
    res.status(200)
  } catch (error) {
    const { name, message, stack } = error
    result = { name, message, stack }
    logger.error(`${action} error. ${JSON.stringify(result)}`)
    res.status(res.statusCode !== 200 ? res.statusCode : 500)
  } finally {
    const end = process.hrtime(begin)
    const durationMs = (end[0] * NS_PER_SEC + end[1]) / MS_PER_SEC
    if (!res.headersSent) {
      res.append('durationMs', durationMs)
      res.json(result)
    }
  }
}

module.exports = { wrapAsync }
export default { wrapAsync }
