const NormalWorkLine = require('./iNormalWorkLine')
const config = require('../config.json')

class fileOperatorLine extends NormalWorkLine {
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

module.exports = fileOperatorLine
