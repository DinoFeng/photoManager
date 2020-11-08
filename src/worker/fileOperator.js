const BaseWorkman = require('./iWorkman')
const tools = require('../util/tools')

class FileOperator extends BaseWorkman {
  async DoWork(input, taskId) {
    const { data: { fullFileName, newFullFileName } } = input
    const data = await tools.moveFile(fullFileName, newFullFileName, tools.actionWhenExistOptions.Rename)
    return { data }
  }
}

module.exports = FileOperator
