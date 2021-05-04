import _ from 'lodash'
import path from 'path'
import tools from '../util/tools'
import { logger } from '../util/logger'

class PhotoManager {
  static async savePhotoFileInfo(connection, file) {
    logger.debug('storageFinish begin')
    const { path, fileName, fullName, md5, sha1, sha256, sha512, exif, size, originalname, mimetype, rootDir } = file
    const runner = connection.createQueryRunner()
    await runner.connect()
    await runner.startTransaction()
    try {
      const baseData = {
        fullName,
        dirName: path,
        baseName: fileName,
        originalName: originalname,
        imageType: mimetype,
        rootDir,
        size,
        active: true,
      }
      const baseRep = runner.manager.getRepository('PhotoBase')
      const baseInfo = await baseRep.save(baseData, { reload: true })
      const baseId = baseInfo.id
      const hashData = {
        baseId,
        md5,
        sha1,
        sha256,
        sha512,
        active: true,
      }
      const exifData = {
        baseId,
        exifJson: JSON.stringify(exif),
        active: true,
      }
      const hashRep = runner.manager.getRepository('PhotoHash')
      const exifRep = runner.manager.getRepository('PhotoExif')
      const [{ id: hashId }, { id: exifId }] = await Promise.all([
        hashRep.save(hashData, { reload: true }),
        exifRep.save(exifData, { reload: true }),
      ])
      await runner.commitTransaction()
      _.merge(file, {
        baseId,
        exifId,
        hashId,
      })
      return {
        baseId,
        exifId,
        hashId,
      }
    } catch (error) {
      logger.error(error)
      await runner.rollbackTransaction()
    }
    logger.debug('storageFinish end')
  }

  static getPathByBirthday(file, root) {
    const { exif } = file || {}
    const birthday = tools.getExifBirthday(exif)
    return path.join(root, `${birthday.toFormat('yyyy/yyyy-MM-dd')}`)
  }

  static moveFileByBirthday(file) {}

  static moveSameFileByBirthday(file) {}
}

module.exports = PhotoManager
export default PhotoManager
