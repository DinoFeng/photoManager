const NS_PER_SEC = 1e9
const MS_PER_SEC = 1e6
const { log4js } = require('../util/logger')
const logger = log4js.getLogger('app')

const formatJson = func => async (req, res, next) => {
  const begin = process.hrtime()
  let result = null
  try {
    result = await func(req, res, next)
    res.status(200)
  } catch (error) {
    logger.error(error)
    const { name, message, stack } = error
    result = { error: { name, message, stack } }
    res.status(500)
  } finally {
    const end = process.hrtime(begin)
    res.append('durationMs', (end[0] * NS_PER_SEC + end[1]) / MS_PER_SEC)
    res.json(result)
  }
}

const sendFile = func => async (req, res, next) => {
  const begin = process.hrtime()
  let fileName = null
  let errInfo = null
  try {
    fileName = await func(req, res, next)
  } catch (error) {
    logger.error(error)
    const { name, message, stack } = error
    errInfo = { error: { name, message, stack } }
  } finally {
    const end = process.hrtime(begin)
    res.append('durationMs', (end[0] * NS_PER_SEC + end[1]) / MS_PER_SEC)
    if (fileName) {
      res.status(200)
      res.sendFile(fileName)
    } else {
      if (errInfo) {
        res.status(500)
        res.json(errInfo)
      } else {
        res.status(404)
        res.json('file not found.')
      }
    }
  }
}
module.exports = { formatJson, sendFile }
