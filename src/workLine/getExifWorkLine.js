const NormalWorkLine = require('./iNormalWorkLine')
const config = require('../config')

class GetExifWorkLine extends NormalWorkLine {
  get workerName() {
    return 'GetExifWorker'
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
