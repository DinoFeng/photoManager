const BaseWorkman = require('./iWorkman')
const tools = require('../util/tools')
const fs = require('fs')

class GetHashWorker extends BaseWorkman {
  async DoWork(input, taskId) {
    const { data: { path: fullFileName, state } } = input
    const buffer = fs.readFileSync(fullFileName)
    const [md5, sha1, sha256, sha512] = await Promise.all(
      ['md5', 'sha1', 'sha256', 'sha512'].map(type => tools.genCrypto(buffer, type)),
    )
    const hashFlags = { md5, sha1, sha256, sha512 }
    return { data: { fullFileName, hashFlags, state } }
  }
}

module.exports = GetHashWorker
