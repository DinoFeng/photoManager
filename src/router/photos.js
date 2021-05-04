import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { DateTime } from 'luxon'
import { v1 as uuidV1 } from 'uuid'
import _ from 'lodash'
import { Not } from 'typeorm'

import PhotoManager from '../service/photoManager'
import { wrapAsync } from '../util/common'
import { logger } from '../util/logger'
import tools from '../util/tools'
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
    const extName = path.parse(file.originalname).ext
    cb(null, `${uuidV1()}${extName}`)
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
  const hashRep = connection.getRepository('PhotoHash')
  const { hashId, md5, sha1, sha256, sha512, exif } = file
  const birthday = tools.getExifBirthday(exif)
  const entity = await hashRep.findOne({ md5, sha1, sha256, sha512, id: Not(hashId) })
  // 是否有exif birthday
  if (birthday) {
    logger.debug(`Birthday is ${birthday}`)
    if (entity) {
      // 有相同文件, 移动动
      logger.debug('Photo already exists.')
    } else {
      // 没有相同文件, 移动到按日期分类的目录
      logger.debug('Photo not exists.')
    }
  } else {
    // don't move
    // save info to db
  }
}

// const limits = {}
const upload = multer({ storage, fileFilter })
// const upload = multer({ storage })

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
    // const opraters = files.reduce(async (pre, cur, index) => {
    //   const res = await fileOprator(c, cur, index)
    //   pre.push(res)
    //   return pre
    // }, [])
    const opraters = []
    for (const file of files) {
      const res = await PhotoManager.savePhotoFileInfo(c, file)
      await fileOprator(c, file)
      opraters.push(res)
    }
    const xFiles = files.map(
      ({
        fileName,
        stat,
        path,
        size,
        md5,
        sha1,
        sha256,
        sha512,
        exif,
        originalname,
        fieldname,
        encoding,
        mimetype,
        fullName,
        baseId,
        exifId,
        hashId,
      }) => ({
        baseId,
        exifId,
        hashId,
        path,
        fieldname,
        originalname,
        mimetype,
        encoding,
        size,
        md5,
        sha1,
        sha256,
        sha512,
        exif,
        fileName,
        stat,
      }),
    )
    return { data, xFiles, opraters }
    // logger.debug('xx', data)
    // res.status(200).json(JSON.stringify(data))
    // res.status(200).json({ data, xFiles })
  }),
)

module.exports = router
export default router
