import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import iconv from 'iconv-lite'
// import ec from 'encoding_convertor'
import { logger } from '../util/logger'
// import myStorageEngine from '../util/multerStorageEngine'
const myStorageEngine = require('../util/multerStorageEngine')
const router = express()

const storage = myStorageEngine({
  destination: function (req, file, cb) {
    // const data = req.body
    // const exif = getExif(file.buffer)
    // logger.debug('yy', exif)
    // const { CreateDate, DateTimeOriginal, ModifyDate } = getExifDate(exif) || {}
    // const birthDate = CreateDate || DateTimeOriginal || ModifyDate
    // const dest = path.join('upload', 'photos', `${birthDate.toFormat('yyyy/yyyy-MM-dd')}`)
    const dest = path.join('upload', 'photos')
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    cb(null, dest)
    //   const chunks = []
    //   file.stream.on('error', (err) => {
    //     // Be sure to handle this properly!
    //     logger.error(err)
    //   })
    //   file.stream.on('end', () => {
    //     const exif = getExif(Buffer.concat(chunks))
    // req.body = _.merge(req.body, { [file.originalname]: exif })
    //     logger.debug(req.body)

    //     // const { CreateDate, DateTimeOriginal, ModifyDate } = getExifDate(exif) || {}
    //     // const birthDate = CreateDate || DateTimeOriginal || ModifyDate
    //     // const dest = path.join('upload', 'photos', `${birthDate.toFormat('yyyy/yyyy-MM-dd')}`)
    //     // // const dest = path.join('upload', 'photos')
    //     // if (!fs.existsSync(dest)) {
    //     //   fs.mkdirSync(dest, { recursive: true })
    //     // }
    //     // cb(null, dest)
    //   })
    //   file.stream.on('data', (chunk) => {
    //     chunks.push(chunk)
    //   })
  },
  filename: function (req, file, cb) {
    const { name } = req.body
    const b = iconv.encode(file.originalname, 'gbk')
    const bb = iconv.encode('微信图片_20210429104607.jpg', 'gbk')
    // const b = Buffer.from(file.originalname, 'utf8')
    // // const s=b.toString('')
    // const s = iconv.decode(b, 'utf8')
    logger.debug({ b, bb, name })
    cb(null, file.originalname)
  },
  // writed: function (file, cb) {
  //   // logger.debug('end', file.buffer)
  //   if (file.buffer) {
  //     const exif = getExif(file.buffer)
  //     const { CreateDate, DateTimeOriginal, ModifyDate } = getExifDate(exif) || {}
  //     const birthDate = CreateDate || DateTimeOriginal || ModifyDate
  //     if (birthDate) {
  //       logger.debug(file.path, `${birthDate.toFormat('yyyy/yyyy-MM-dd')}`)
  //     }
  //   }
  // },
})

const fileFilter = function (req, file, cb) {
  // 这个函数应该调用 `cb` 用boolean值来
  // 指示是否应接受该文件

  // 拒绝这个文件，使用`false`，像这样:
  // cb(null, false)
  logger.debug(`${file.originalname} mimetype is:${file.mimetype}`)

  // // 接受这个文件，使用`true`，像这样:
  cb(null, ['image/jpeg', 'image/png'].includes(file.mimetype))

  // // 如果有问题，你可以总是这样发送一个错误:
  // cb(new Error("I don't have a clue!"))
}

// const limits = {}
const upload = multer({ storage, fileFilter })
// const upload = multer({ storage })

router.post('/', upload.array('photos'), (req, res, next) => {
  // upload(req, res, function (err) {
  //   if (err instanceof multer.MulterError) {
  //     // 发生错误
  //   } else if (err) {
  //     // 发生错误
  //   }
  //   // 一切都好
  // })
  const data = req.body
  const files = req.files
  const xFiles = files.map(({
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
  }) => ({
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
  }))
  // logger.debug('xx', data)
  // res.status(200).json(JSON.stringify(data))
  res.status(200).json({ data, xFiles })
})

module.exports = router
export default router
