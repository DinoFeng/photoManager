const BaseWorkman = require('./iWorkman')
const tools = require('../util/tools')
const fs = require('fs')

class GetExifWorker extends BaseWorkman {
  async DoWork(input, taskId) {
    const { data: fullFileName } = input
    let { exifInfo, imageType, isImage, error } = {}
    try {
      const buffer = fs.readFileSync(fullFileName)
      imageType = await tools.getImageType(buffer)
      if (imageType) {
        exifInfo = await tools.getExif(buffer)
        isImage = true
      } else {
        isImage = false
      }
    } catch (err) {
      const { name, message, stack } = err
      error = { name, message, stack }
    }
    return { fullFileName, exifInfo, imageType, isImage, error }
  }
}

module.exports = GetExifWorker
