const NormalWorkLine = require('./iNormalWorkLine')

class fileOperatorLine extends NormalWorkLine {
  get workerName() {
    return 'FileOperator'
  }

  get bindExchange() {
    return 'exportExifInfo'
  }
}

module.exports = fileOperatorLine
