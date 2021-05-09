import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { DateTime } from 'luxon'
import { v1 as uuidV1 } from 'uuid'
import _ from 'lodash'

import PhotoManager from '../service/photoManager'
import { wrapAsync } from '../util/common'
import { logger } from '../util/logger'
import myStorageEngine from '../util/multerStorageEngine'

const router = express()
const rootDir = 'upload/photos'

const storage = myStorageEngine({
  destination: function (req, file, cb) {
    const userInfo = req.userInfo
    const { uniqueName } = userInfo || {}
    const user = uniqueName || 'unknown'
    const uploadDate = DateTime.now()
    const dest = path.join(`${rootDir}`, user, `${uploadDate.toFormat('yyyy/yyyy-MM-dd')}`)
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    _.merge(file, { rootDir })
    cb(null, dest)
  },
  filename: function (req, file, cb) {
    const pathInfo = path.parse(file.originalname)
    const { ext: extName, name } = pathInfo || {}
    cb(null, `[${name}]${uuidV1()}${extName}`)
  },
  // storageFinish: async function (req, file, cb) {
  //   return cb(null, file)
  // },
})

const fileFilter = function (req, file, cb) {
  // 这个函数应该调用 `cb` 用boolean值来
  // 指示是否应接受该文件
  logger.debug(`${file.originalname},${file.path} mimetype is:${file.mimetype}`)

  // 拒绝这个文件，使用`false`，像这样:
  // cb(null, false)

  // // 接受这个文件，使用`true`，像这样:
  // cb(null, ['image/jpeg', 'image/png'].includes(file.mimetype))
  const patten = '^image/(.+)$'
  const reg = new RegExp(patten, 'i')
  cb(null, reg.test(file.mimetype))

  // // 如果有问题，你可以总是这样发送一个错误:
  // cb(new Error("I don't have a clue!"))
}

const fileOprator = async (connection, file) => {
  try {
    const { file: fileInfo, exception, dbId } = await PhotoManager.manager(connection, rootDir, file)
    _.merge(file, fileInfo)
    return { dbId, exception, file }
  } catch (e) {
    const { name, message, stack } = e
    const exception = { name, message, stack }
    // logger.error('fileOprator error', { name, message, stack })
    return { exception, file }
  }
}

// const limits = {}
const upload = multer({ storage, fileFilter })

router.post(
  '/',
  upload.array('photos'),
  wrapAsync(async (req, res, next) => {
    // upload(req, res, function (err) {
    //   if (err instanceof multer.MulterError) {
    //     // 发生错误
    //     throw new Error(`ssss:${err.message}`)
    //   } else if (err) {
    //     // 发生错误
    //     throw err
    //   }
    //   // 一切都好
    // })
    // const connection = req.getConnection()
    const data = req.body
    const files = req.files
    const c = req.getConnection()
    const operator = []
    for (const file of files) {
      const r = await fileOprator(c, file)
      logger.debug('fileOprator result', r)
      operator.push(r)
    }
    const xFiles = files
    return { data, xFiles, operator }
  }),
)

module.exports = router
export default router
