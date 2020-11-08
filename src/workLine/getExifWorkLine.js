const NormalWorkLine = require('./iNormalWorkLine')
const config = require('../config')

class GetExifWorkLine extends NormalWorkLine {
  get workerName() {
    return 'GetExifWorker'
  }

  get maxRetries() {
    return 2
  }

  get exportExchange() {
    const name = 'exportImportExifInfo'
    return {
      name,
      type: config.exchange[name],
    }
  }

  get bindExchange() {
    const name = 'watchImportFolder'
    return {
      name,
      type: config.exchange[name],
    }
  }
}

module.exports = GetExifWorkLine
