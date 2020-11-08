const NormalWorkLine = require('./iNormalWorkLine')
const { assignWorker } = require('../worker/workmanFactory')

class AdoWorkLine extends NormalWorkLine {
  get ADO() {
    return null
  }

  get repositories() {
    return null
  }

  async runWork(data, taskId, self) {
    const worker = assignWorker(self.workerName)
    return await worker.DoWork(data, taskId, self.repositories)
  }
}

module.exports = AdoWorkLine
