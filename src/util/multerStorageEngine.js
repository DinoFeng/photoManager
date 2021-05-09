import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import tools from '../util/tools'

function getDestination(req, file, cb) {
  const dest = path.join('temp')
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  cb(null, dest)
}

function getFileName(req, file, cb) {
  cb(null, file.originalname)
}

function storageFinish(req, file, cb) {
  cb(null, file)
}

function MyCustomStorage(opts) {
  this.getDestination = opts.destination || getDestination
  this.getFileName = opts.filename || getFileName
  this.storageFinish = opts.storageFinish || storageFinish
}

MyCustomStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  this.getDestination(req, file, (err, dir) => {
    if (err) return cb(err)

    this.getFileName(req, file, (error, fileName) => {
      if (error) return cb(error)
      const fullName = path.join(dir, fileName)

      const outStream = fs.createWriteStream(fullName)
      const hashs = ['md5', 'sha1', 'sha256', 'sha512'].map((t) => tools.genCryptoHash(t))
      const chunks = []
      let buffer
      file.stream.on('data', (chunk) => {
        chunks.push(chunk)
      })
      file.stream.on('end', () => {
        buffer = Buffer.concat(chunks)
        hashs.forEach((h) => h.end())
      })

      file.stream.pipe(outStream)
      hashs.forEach((h) => file.stream.pipe(h))
      outStream.on('error', cb)
      outStream.on('finish', () => {
        // const [md5, sha1, sha256, sha512] = await Promise.all(['md5', 'sha1', 'sha256', 'sha512'].map(type => tools.genCrypto(buffer, type)))
        Promise.all([...hashs.map((h) => h.read()), tools.getExif(buffer)]).then(
          ([md5, sha1, sha256, sha512, exif]) => {
            _.merge(file, {
              path: dir,
              fileName,
              size: outStream.bytesWritten,
              fullName,
              md5,
              sha1,
              sha256,
              sha512,
              exif,
              // buffer,
            })
            return this.storageFinish(req, file, (e, file) => {
              if (e) return cb(e)
              cb(null, {})
            })
          },
        )
      })
    })
  })
}

MyCustomStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  fs.unlink(file.path, cb)
}

module.exports = function (opts) {
  return new MyCustomStorage(opts)
}
export default function (opts) {
  return new MyCustomStorage(opts)
}
