// import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import tools from '../util/tools'
import { Not } from 'typeorm'
import { logger } from '../util/logger'

const cnn = Symbol('cnn')
const root = Symbol('root')
class PhotoManager {
  constructor(connection, rootDir) {
    this[cnn] = connection
    this[root] = rootDir
  }

  static async manager(connection, rootDir, file) {
    const photoManager = new PhotoManager(connection, rootDir)
    const { baseId, exifId, hashId } = await photoManager.savePhotoFileInfo(file)
    const { exif } = file
    const birthday = tools.getExifBirthday(exif)
    // 是否有exif birthday
    if (birthday) {
      try {
        logger.info(`Birthday is ${birthday}`)
        const entity = await photoManager.findSamePhoto(file, hashId)

        logger.info(entity ? 'Photo already exist same.' : 'Photo not same.')
        const newDir = entity
          ? path.join(`${rootDir}`, `${birthday.toFormat('yyyy/yyyy-MM-dd')}`, 'same')
          : path.join(`${rootDir}`, `${birthday.toFormat('yyyy/yyyy-MM-dd')}`)
        const { path: dir, fileName, fullName, exception } = await photoManager.moveFile(file, { baseId, newDir })

        return { dbId: { baseId, exifId, hashId }, exception, file: { path: dir, fileName, fullName } }
      } catch (e) {
        const { name, message, stack } = e
        return { dbId: { baseId, exifId, hashId }, exception: { name, message, stack } }
      }
    } else {
      // don't move
      // save info to db
      logger.info('No birthday')
      return { dbId: { baseId, exifId, hashId }, file: {} }
    }
  }

  async moveFile(file, { baseId, newDir }) {
    // const connection = this[cnn]
    const { fullName, fileName, originalname } = file
    try {
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true })
      }
      let newFileName = originalname
      let newFullName = path.join(newDir, newFileName)
      if (fs.existsSync(newFullName)) {
        newFileName = fileName
        newFullName = path.join(newDir, newFileName)
      }
      fs.renameSync(fullName, newFullName)
      return await this.updatePhotoFilePath(file, { baseId, newDir, newFullName, newFileName })
    } catch (e) {
      const { name, message, stack } = e
      return { exception: { name, message, stack } }
    }
  }

  async savePhotoFileInfo(file) {
    const connection = this[cnn]
    logger.debug('savePhotoFileInfo begin')
    const rootDir = this[root]
    const { path: dir, fileName, fullName, md5, sha1, sha256, sha512, exif, size, originalname, mimetype } = file
    const runner = connection.createQueryRunner()
    await runner.connect()
    await runner.startTransaction()
    try {
      const baseRep = runner.manager.getRepository('PhotoBase')
      const baseData = {
        fullName,
        dirName: dir,
        baseName: fileName,
        originalName: originalname,
        imageType: mimetype,
        rootDir,
        size,
        active: true,
      }

      let { baseId, exifId, hashId } = {}
      const baseEntify = await baseRep.findOne({ fullName })
      if (!baseEntify) {
        const baseInfo = await baseRep.save(baseData, { reload: true })
        baseId = baseInfo.id
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

        const [hashInfo, exifInfo] = await Promise.all([
          hashRep.save(hashData, { reload: true }),
          exifRep.save(exifData, { reload: true }),
        ])
        exifId = exifInfo.id
        hashId = hashInfo.id
      } else {
        baseId = baseEntify.id
        const x = await baseRep.update({ id: baseId }, baseData)
        logger.debug('updated:', x)
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

        const [hashInfo, exifInfo] = await Promise.all([
          hashRep
            .findOne({ baseId })
            .then((r) =>
              r ? hashRep.update({ id: r.id }, hashData).then(() => r) : hashRep.save(hashData, { reload: true }),
            ),
          exifRep
            .findOne({ baseId })
            .then((r) =>
              r ? exifRep.update({ id: r.id }, exifData).then(() => r) : exifRep.save(exifData, { reload: true }),
            ),
        ])
        exifId = exifInfo.id
        hashId = hashInfo.id
      }

      await runner.commitTransaction()
      logger.debug('savePhotoFileInfo done')

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

  async findSamePhoto(file, excludeHashId) {
    const connection = this[cnn]
    const hashRep = connection.getRepository('PhotoHash')
    const { md5, sha1, sha256, sha512 } = file
    const condition = excludeHashId
      ? { md5, sha1, sha256, sha512, id: Not(excludeHashId) }
      : { md5, sha1, sha256, sha512 }
    const entity = await hashRep.findOne(condition)
    return entity
  }

  async findSamePhotos(file, excludeHashId) {
    const connection = this[cnn]
    const hashRep = connection.getRepository('PhotoHash')
    const { md5, sha1, sha256, sha512 } = file
    const condition = excludeHashId
      ? { md5, sha1, sha256, sha512, id: Not(excludeHashId) }
      : { md5, sha1, sha256, sha512 }
    const entities = await hashRep.find(condition)
    return entities
  }

  async updatePhotoFilePath(file, { baseId, newDir, newFullName, newFileName }) {
    const connection = this[cnn]
    // const { baseId } = file
    const rep = connection.getRepository('PhotoBase')
    await rep.update(
      { id: baseId },
      {
        fullName: newFullName,
        dirName: newDir,
        baseName: newFileName,
      },
    )
    return {
      path: newDir,
      fileName: newFileName,
      fullName: newFullName,
    }
  }
}

module.exports = PhotoManager
export default PhotoManager
