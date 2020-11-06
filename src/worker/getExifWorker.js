const BaseWorkman = require('./iWorkman')
const tools = require('../util/tools')
const fs = require('fs')

class GetExifWorker extends BaseWorkman {
  async DoWork(input, taskId) {
    const { data: { path: fullFileName, state } } = input
    const buffer = fs.readFileSync(fullFileName)
    const imageType = await tools.getImageType(buffer)
    const exifInfo = imageType ? await tools.getExif(buffer) : null
    return { data: { fullFileName, exifInfo, imageType, state } }
  }
}

module.exports = GetExifWorker
