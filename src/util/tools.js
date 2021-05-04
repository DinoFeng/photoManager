import _ from 'lodash'
import crypto from 'crypto'
import exifParser from 'exif-parser'
import { DateTime } from 'luxon'
import { logger } from './logger'

const tools = {
  trimEndStr(v, s) {
    const reg = RegExp(`^(.*)${s}$`, 'i')
    return _.replace(v, reg, '$1')
  },

  genCryptoHash(type, encoding) {
    return crypto.createHash(type).setEncoding(encoding || 'hex')
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
          } catch (err) {
            reject(err)
          }
        })
        streamReader.pipe(hash)
      } catch (err) {
        reject(err)
      }
    })
  },

  genCrypto(buffer, type) {
    const hash = crypto.createHash(type)
    hash.update(buffer)
    const code = hash.digest('hex')
    return code
  },

  getExif(buffer) {
    try {
      const parser = exifParser.create(buffer)
      return parser.parse()
    } catch (error) {
      logger.error(error)
      return null
    }
  },

  getExifDate(exif) {
    if (exif) {
      const { tags } = exif || {}
      const { CreateDate: createDate, DateTimeOriginal: dateTimeOriginal, ModifyDate: modifyDate } = tags || {}
      // const createDate = _.get(exif, ['tags', 'CreateDate'])
      // const dateTimeOriginal = _.get(exif, ['tags', 'DateTimeOriginal'])
      // const modifyDate = _.get(exif, ['tags', 'ModifyDate'])

      const CreateDate = createDate ? DateTime.fromMillis(createDate * 1000, { zone: 'UTC' }) : null
      const DateTimeOriginal = dateTimeOriginal ? DateTime.fromMillis(dateTimeOriginal * 1000, { zone: 'UTC' }) : null
      const ModifyDate = modifyDate ? DateTime.fromMillis(modifyDate * 1000, { zone: 'UTC' }) : null

      return { CreateDate, DateTimeOriginal, ModifyDate }
    } else {
      return null
    }
  },

  getExifBirthday(exif) {
    const { CreateDate, DateTimeOriginal, ModifyDate } = this.getExifDate(exif)
    const birthday = CreateDate || DateTimeOriginal || ModifyDate
    return birthday
  },
}
module.exports = tools
export default tools
