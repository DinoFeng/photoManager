const NormalWorkLine = require('./iNormalWorkLine')
const config = require('../config')

class FileOperatorLine extends NormalWorkLine {
  get workerName() {
    return 'FileOperator'
  }

  get bindExchange() {
    const name = 'exportNewPath'
    return {
      name,
      type: config.exchange[name],
    }
  }
}

module.exports = FileOperatorLine
