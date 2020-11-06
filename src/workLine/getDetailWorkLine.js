const NormalWorkLine = require('./iNormalWorkLine')
const config = require('../config.json')

class GetExifWorkLine extends NormalWorkLine {
  get workerName() {
    return 'GetDetailWorker'
  }

  get exportExchange() {
    const name = 'exportDetailInfo'
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
      key: 'add',
    }
  }
}

module.exports = GetExifWorkLine
