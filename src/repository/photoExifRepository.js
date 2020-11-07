const _ = require('lodash')
const BaseRepository = require('./iRepository')
const _createTable = Symbol('createTable')
const _createUniqueIndex = Symbol('createUniqueIndex')
class PhotoBaseInfoRepository extends BaseRepository {
  get tableName() {
    return 'PhotoExif'
  }

  async InitTable() {
    return this[_createTable]()
      .then(() => Promise.all([
        this[_createUniqueIndex](),
      ]))
      .then(() => true)
  }

  async [_createTable]() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL UNIQUE,
        orgExifJson TEXT,
        imageSize TEXT,
        thumbnailOffset INTEGER,
        thumbnailLength INTEGER,
        thumbnailType INTEGER,
        app1Offset INTEGER,
        Make TEXT,
        Model TEXT,
        Orientation INTEGER,
        XResolution INTEGER,
        YResolution INTEGER,
        ResolutionUnit INTEGER,
        Software TEXT,
        ModifyDate INTEGER,
        YCbCrPositioning INTEGER,
        ExposureTime NUMERIC,
        FNumber NUMERIC,
        ExposureProgram INTEGER,
        ISO INTEGER,
        DateTimeOriginal INTEGER,
        CreateDate INTEGER,
        CompressedBitsPerPixel NUMERIC,
        ShutterSpeedValue NUMERIC,
        ApertureValue NUMERIC,
        ExposureCompensation INTEGER,
        MaxApertureValue NUMERIC,
        MeteringMode INTEGER,
        Flash INTEGER,
        FocalLength NUMERIC,
        SubSecTime TEXT,
        ColorSpace INTEGER,
        ExifImageWidth INTEGER,
        ExifImageHeight INTEGER,
        ExposureIndex INTEGER,
        SensingMethod INTEGER,
        CustomRendered INTEGER,
        ExposureMode INTEGER,
        WhiteBalance INTEGER,
        DigitalZoomRatio INTEGER,
        FocalLengthIn35mmFormat INTEGER,
        SceneCaptureType INTEGER,
        GainControl INTEGER,
        Contrast INTEGER,
        Saturation INTEGER,
        Sharpness INTEGER,
        SubjectDistanceRange INTEGER,
        InteropIndex TEXT,
        GPSLatitudeRef TEXT,
        GPSLatitude NUMERIC,
        GPSLongitudeRef TEXT,
        GPSLongitude NUMERIC,
        GPSAltitudeRef NUMERIC,
        GPSAltitude INTEGER,
        GPSTimeStamp TEXT,
        GPSProcessingMethod TEXT,
        GPSDateStamp TEXT,
        SubSecTimeDigitized TEXT,
        SubSecTimeOriginal TEXT,
        BrightnessValue NUMERIC,
        active TEXT,
        updatedAt TEXT)`
    return this.dao.run(sql)
  }

  async [_createUniqueIndex]() {
    const sql = `
      CREATE UNIQUE INDEX IF NOT EXISTS idx_${this.tableName}_unique ON ${this.tableName}(fullName)`
    return this.dao.run(sql)
  }

  async delete(data) {
    if (_.isNumber(data) && data) {
      return this.dao.run(
        `DELETE FROM ${this.tableName} WHERE id = ?`,
        [data],
      )
    } else if (_.isString(data) && data) {
      return this.dao.run(
        `DELETE FROM ${this.tableName} WHERE fullName = ?`,
        [data],
      )
    } else {
      const { fullName } = data || {}
      if (fullName) {
        return this.dao.run(
          `DELETE FROM ${this.tableName} WHERE fullName = ?`,
          [fullName],
        )
      }
    }
  }
}
module.exports = PhotoBaseInfoRepository
