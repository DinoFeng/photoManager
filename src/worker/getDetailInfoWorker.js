const BaseWorkman = require('./iWorkman')
const tools = require('../util/tools')
const fs = require('fs')

class GetDetailWorker extends BaseWorkman {
  async processSaveData(path, state) { }

  async processDeleteData(path, state) { }

  async DoWork(input, taskId) {
    const { data: { event, path, state } } = input
    switch (event) {
      case 'add':
      case 'change':
        return await this.processSaveData(path, state)
      case 'unlink':
        return await this.processDeleteData(path, state)
      default:
        return null
    }
  }
}

module.exports = GetDetailWorker
