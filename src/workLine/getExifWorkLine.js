const NormalWorkLine = require('./iNormalWorkLine')

class GetExifWorkLine extends NormalWorkLine {
  get workerName() {
    return 'GetExifWorker'
  }

  get exportExchange() {
    return 'exportExifInfo'
  }

  get bindExchange() {
    return 'watchFolderExchange'
  }
}

module.exports = GetExifWorkLine
