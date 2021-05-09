// import _ from 'lodash'
import chokidar from 'chokidar'
import mime from 'mime-types'
import fs from 'fs'
import path from 'path'
import PhotoManager from './photoManager'
import { logger } from '../util/logger'
import tools from '../util/tools'

const readFile = async (fullName) =>
  new Promise((resolve, reject) => {
    // logger.info(`Begin read ${fullName}：`)
    const readStream = fs.createReadStream(fullName)
    const hashs = ['md5', 'sha1', 'sha256', 'sha512'].map((t) => tools.genCryptoHash(t))
    const chunks = []
    let buffer
    hashs.forEach((h) => readStream.pipe(h))
    readStream.on('data', (chunk) => {
      chunks.push(chunk)
    })
    readStream.on('end', () => {
      buffer = Buffer.concat(chunks)
      hashs.forEach((h) => h.end())
      Promise.all([...hashs.map((h) => h.read()), tools.getExif(buffer)]).then(([md5, sha1, sha256, sha512, exif]) => {
        const pathInfo = path.parse(fullName)
        resolve({
          path: pathInfo.dir,
          originalname: pathInfo.base,
          fileName: pathInfo.base,
          size: readStream.bytesRead,
          fullName,
          mimetype: mime.lookup(pathInfo.base),
          md5,
          sha1,
          sha256,
          sha512,
          exif,
          // buffer,
        })
      })
    })
    readStream.on('error', reject)
  })

const rootDir = 'upload/photos'

const folderWatch = (connectionPool) => {
  const watchFolder = 'upload/import'
  if (!fs.existsSync(watchFolder)) {
    fs.mkdirSync(watchFolder, { recursive: true })
  }
  logger.info({ watchFolder })
  const watcher = chokidar.watch(watchFolder, { persistent: true, ignoreInitial: false })
  watcher
    .on('add', async (path) => {
      logger.info(`Added File: ${path}`)
      setTimeout(async () => {
        const file = await readFile(path)
        logger.info(`${path}：`, file)
        const result = await PhotoManager.manager(connectionPool.getConnection(), rootDir, file)
        logger.info(`${path} result：`, result)
      }, 10000)
    })
    .on('change', async (path) => {
      logger.debug(`Changed file: ${path}`)
      // channel.publish(exchange, 'change', Buffer.from(JSON.stringify({ data: path })))
    })
    .on('unlink', (path) => {
      logger.debug(`Removed file: ${path}`)
      // channel.publish(exchange, 'unlink', Buffer.from(JSON.stringify({ data: path })))
    })
    .on('error', (error) => logger.error(error))
    .on('ready', () => logger.info('Initial scan complete. Ready for changes'))
}

module.exports = folderWatch
export default folderWatch
