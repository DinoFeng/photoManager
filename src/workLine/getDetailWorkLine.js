const NormalWorkLine = require('./iNormalWorkLine')
const config = require('../config')

class GetDetailWorkLine extends NormalWorkLine {
  get workerName() {
    return 'GetDetailInfoWorker'
  }

  get exportExchange() {
    const name = 'exportPhotoEventDetailInfo'
    return {
      name,
      type: config.exchange[name],
    }
  }

  get bindExchange() {
    const name = 'watchPhotoFolder'
    return {
      name,
      type: config.exchange[name],
    }
  }
}

module.exports = GetDetailWorkLine
