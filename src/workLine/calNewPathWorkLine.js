const NormalWorkLine = require('./iNormalWorkLine')
const config = require('../config.json')

class GetExifWorkLine extends NormalWorkLine {
  get workerName() {
    return 'CalNewPathWorker'
  }

  get exportExchange() {
    const name = 'exportNewPath'
    return {
      name,
      type: config.exchange[name],
    }
  }

  get bindExchange() {
    const name = 'exportDetailInfo'
    return {
      name,
      type: config.exchange[name],
    }
  }
}

module.exports = GetExifWorkLine
