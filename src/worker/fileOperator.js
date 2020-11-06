// const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const BaseWorkman = require('./iWorkman')
const tools = require('../util/tools')
const config = require('../config.json')

class FileOperator extends BaseWorkman {
  async DoWork(input, taskId) {
    // const { data: { fullFileName, exifInfo, imageType, state } } = input

    // const { CreateDate } = tools.getExifDate(exifInfo) || {}
    // const importPath = config.folder.watch

    // const newPath = imageType
    //   ? CreateDate
    //     ? path.join(_.get(config, ['folder', 'photo']), `${CreateDate.getFullYear()}/${CreateDate.getMonth()}/${CreateDate.getDate()}`)
    //     : _.get(config, ['folder', 'picture'])
    //   : _.get(config, ['folder', 'other'])

    // // const extName = path.extname(fullFileName)
    // const baseName = path.basename(fullFileName)
    // const dirName = path.dirname(fullFileName)
    // const relative = path.relative(importPath, dirName)

    // const newFullFileName = CreateDate ? path.join(newPath, baseName) : path.join(newPath, relative, baseName)
    // return { fullFileName, newFullFileName, newPath, baseName, dirName, relative, state }
  }
}

module.exports = FileOperator
