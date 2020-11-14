// const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const BaseWorkman = require('./iWorkman')
const tools = require('../util/tools')
const config = require('../config')

class CalNewPathWorker extends BaseWorkman {
  async DoWork(input, taskId) {
    const { data: { fullFileName, exifInfo, imageType, hashFlags, state } } = input

    const { CreateDate, DateTimeOriginal, ModifyDate } = tools.getExifDate(exifInfo) || {}
    const birthDate = CreateDate || DateTimeOriginal || ModifyDate
    const importPath = config.folder.import

    const newPath = imageType
      ? birthDate
        ? path.join(_.get(config, ['folder', 'photo']), `${birthDate.toFormat('yyyy/yyyy-MM-dd')}`)
        : _.get(config, ['folder', 'picture'])
      : _.get(config, ['folder', 'other'])

    // const extName = path.extname(fullFileName)
    const baseName = path.basename(fullFileName)
    const dirName = path.dirname(fullFileName)
    const relative = path.relative(importPath, dirName)

    const newFullFileName = birthDate ? path.join(newPath, baseName) : path.join(newPath, relative, baseName)
    return { data: { fullFileName, newFullFileName, exifInfo, imageType, hashFlags, state } }
  }
}

module.exports = CalNewPathWorker
