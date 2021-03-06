const NormalWorkLine = require('./iNormalWorkLine')
const config = require('../config')

class CalNewPathWorkLine extends NormalWorkLine {
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
    const name = 'exportImportExifInfo'
    return {
      name,
      type: config.exchange[name],
    }
  }
}

module.exports = CalNewPathWorkLine
