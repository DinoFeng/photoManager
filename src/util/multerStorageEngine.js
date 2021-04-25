import fs from 'fs'
import path from 'path'

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

function storageFinish(file) {}

function MyCustomStorage(opts) {
  this.getDestination = opts.destination || getDestination
  this.getFileName = opts.filename || getFileName
  this.storageFinish = opts.writed || storageFinish
}

MyCustomStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  this.getDestination(req, file, (err, dir) => {
    if (err) return cb(err)

    this.getFileName(req, file, (error, fileName) => {
      if (error) return cb(error)
      const fullName = path.join(dir, fileName)

      const outStream = fs.createWriteStream(fullName)

      const chunks = []
      // let buffer
      file.stream.on('data', (chunk) => {
        chunks.push(chunk)
      })
      file.stream.on('end', () => {
        file.buffer = Buffer.concat(chunks)
      })

      file.stream.pipe(outStream)
      outStream.on('error', cb)
      outStream.on('finish', () => {
        cb(null, {
          path: fullName,
          size: outStream.bytesWritten,
        })
        this.storageFinish(file)
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
