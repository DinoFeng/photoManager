// const _ = require('lodash')
const NormalWorkLine = require('./iNormalWorkLine')
const { assignWorker } = require('../worker/workmanFactory')

class AdoWorkLine extends NormalWorkLine {
  get ADO() {
    return null
  }

  async runWork(data, taskId, self) {
    const worker = assignWorker(self.workerName)
    return await worker.DoWork(data, taskId, self.ADO)
  }
}

module.exports = AdoWorkLine
