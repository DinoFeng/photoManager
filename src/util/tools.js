const crypto = require('crypto')
// const ExifImage = require('exif').ExifImage
const exifParser = require('exif-parser')
const uuidV1 = require('uuid').v1
const fs = require('fs')

const tools = {
  genUUID() {
    return uuidV1().replace(/-/g, '').toUpperCase()
  },

  genCrypto(buffer, type) {
    const hash = crypto.createHash(type)
    hash.update(buffer)
    const code = hash.digest('hex')
    return code
  },

  async genCryptpForBigFile(streamReader, type) {
    return new Promise((resolve, reject) => {
      try {
        // const file = fs.createReadStream(fileFullName)
        const hash = crypto.createHash(type)
        hash.setEncoding('hex')
        streamReader.on('end', () => {
          try {
            hash.end()
            const code = hash.read()
            resolve(code)
          } catch (err) { reject(err) }
        })
        streamReader.pipe(hash)
      } catch (err) { reject(err) }
    })
  },

  // imageType(buffer) {
  //   return ((buffer[0] === 137 && buffer[1] === 80 &&
  //     buffer[2] === 78 && buffer[3] === 71 &&
  //     buffer[4] === 13 && buffer[5] === 10 &&
  //     buffer[6] === 26 && buffer[7] === 10) && 'png') ||
  //     ((buffer[0] === 66 && buffer[1] === 77) && 'bmp') ||
  //     ((buffer[0] === 71 && buffer[1] === 73 &&
  //       buffer[2] === 70 && buffer[3] === 56) && 'gif') ||
  //     // JPG 文件头
  //     // Start Marker  | JFIF Marker | Header Length | Identifier
  //     // 0xff, 0xd8    | 0xff, 0xe0  |    2-bytes    | "JFIF\0"
  //     ((buffer[0] === 0xff && buffer[1] === 0xd8) && 'jpg') ||
  //     'unknowed'
  // },

  getImageType(fileBuffer) {
    // 将上文提到的 文件标识头 按 字节 整理到数组中
    const imageBufferHeaders = [
      { bufBegin: [0xff, 0xd8], bufEnd: [0xff, 0xd9], suffix: 'jpg' },
      {
        bufBegin: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
        suffix: 'png',
      },
      { bufBegin: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], suffix: 'gif' },
      { bufBegin: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], suffix: 'gif' },
      { bufBegin: [0x42, 0x4d], suffix: 'bmp' },
      { bufBegin: [0x49, 0x49], suffix: 'tif' },
      { bufBegin: [0x4d, 0x4d], suffix: 'tif' },
      { bufBegin: [0x0a], suffix: 'pcx' },
      {
        bufBegin: [0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x20, 0x20],
        suffix: 'ico',
      },
      {
        bufBegin: [0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x20, 0x20],
        suffix: 'cur',
      },
      { bufBegin: [0x52, 0x49, 0x46, 0x46], suffix: 'ani' },
      { bufBegin: [0x00, 0x00, 0x02, 0x00, 0x00], suffix: 'tga' },
      { bufBegin: [0x00, 0x00, 0x10, 0x00, 0x00], suffix: 'rle' },
      { bufBegin: [0x46, 0x4f, 0x52, 0x4d], suffix: 'iff' },
    ]
    for (const imageBufferHeader of imageBufferHeaders) {
      let isEqual
      // 判断标识头前缀
      if (imageBufferHeader.bufBegin) {
        const buf = Buffer.from(imageBufferHeader.bufBegin)
        isEqual = buf.equals(
          // 使用 buffer.slice 方法 对 buffer 以字节为单位切割
          fileBuffer.slice(0, imageBufferHeader.bufBegin.length),
        )
      }
      // 判断标识头后缀
      if (isEqual && imageBufferHeader.bufEnd) {
        const buf = Buffer.from(imageBufferHeader.bufEnd)
        isEqual = buf.equals(fileBuffer.slice(-imageBufferHeader.bufEnd.length))
      }
      if (isEqual) {
        return imageBufferHeader.suffix
      }
    }
    // 未能识别到该文件类型
    // return 'unknowed'
    return null
  },

  getImageFileType(file) {
    const buffer = fs.readFileSync(file)
    return this.getImageType(buffer)
  },

  async getExif(buffer) {
    const parser = exifParser.create(buffer)
    return parser.parse()
  },

  async getFileExif(file) {
    const buffer = fs.readFileSync(file)
    return this.getExif(buffer)
  },

  // async getExif(file) {
  //   return new Promise((resolve, reject) => {
  //     // const ExifImage = exif.ExifImage
  //     try {
  //       return new ExifImage({ image: file }, function (error, exifData) {
  //         if (error) {
  //           // logger.error(error)
  //           reject(error)
  //         } else {
  //           resolve(exifData)
  //         }
  //       })
  //     } catch (error) {
  //       // logger.error(error)
  //       reject(error)
  //     }
  //   })
  // },

}

module.exports = tools
