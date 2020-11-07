const BaseWorkman = require('./iWorkman')
const tools = require('../util/tools')
// const { logger } = require('../util/logger')

class FileOperator extends BaseWorkman {
  async DoWork(input, taskId) {
    const { data: { fullFileName, newFullFileName } } = input
    const data = await tools.moveFile(fullFileName, newFullFileName, tools.actionWhenExistOptions.Rename)
    // logger.trace({ data })
    return { data }
  }
}

module.exports = FileOperator
