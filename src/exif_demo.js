const { logger } = require('./util/logger')
const tools = require('./util/tools')

const exif1 = async (file) => {
  logger.time('exif1')
  const result = await tools.getExif(file)
  logger.timeEnd('exif1')
  return result
}

const exif2 = async (file) => {
  logger.time('exif2')
  const result = await tools.getExif2(file)
  logger.timeEnd('exif2')
  return result
}

  ;
(async () => {
  try {
    const [result, result2] = await Promise.all([exif2('./file/IMG_8535.JPG'), exif1('./file/IMG_8535.JPG')])
    logger.debug({ result, result2 })
    // const parser = exifParser.create(buffer)
    // const result = parser.parse()
    // const ModifyDate = new Date(1501936063 * 1000 + 111)
    // const DateTimeOriginal = new Date(result.tags.DateTimeOriginal * 1000 + 123)
    // const CreateDate = new Date(result.tags.CreateDate * 1000 + 246)

    // logger.debug({ result, ModifyDate, DateTimeOriginal, CreateDate, x: result.tags.ModifyDate })
    // logger.info({ result, ModifyDate, DateTimeOriginal, CreateDate, x: result.tags.ModifyDate })
  } catch (err) {
    // got invalid data, handle error
    logger.error(err)
    // logger.info(err)
  }
})()
