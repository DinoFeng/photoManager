const BaseWorkman = require('./iWorkman')
const tools = require('../util/tools')
const fs = require('fs')

class GetDetailWorker extends BaseWorkman {
  async DoWork(input, taskId) {
    const { data: { path: fullFileName, state } } = input
    const buffer = fs.readFileSync(fullFileName)
    const [imageType, md5, sha1, sha256, sha512] = await Promise.all([
      tools.getImageType(buffer),
      ...['md5', 'sha1', 'sha256', 'sha512'].map(type => tools.genCrypto(buffer, type)),
    ])
    const hashFlags = { md5, sha1, sha256, sha512 }
    const exifInfo = imageType ? await tools.getExif(buffer) : null
    return { data: { fullFileName, exifInfo, imageType, hashFlags, state } }
  }
}

module.exports = GetDetailWorker
