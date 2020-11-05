const { logger } = require('./src/util/logger')
const { assignWorker } = require('./src/worker/workmanFactory')

  ;
(async () => {
  try {
    const x = assignWorker('CheckImageWorker')
    logger.debug(await x.DoWork('A', 'B', 'C'))
  } catch (err) {
    logger.error(err)
  }
})()
