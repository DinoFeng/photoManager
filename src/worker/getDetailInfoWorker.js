const BaseWorkman = require('./iWorkman')
const tools = require('../util/tools')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')

class GetDetailInfoWorker extends BaseWorkman {
  genHashData(fullName, hashInfo) {
    const { md5, sha1, sha256, sha512 } = hashInfo
    return { fullName, md5, sha1, sha256, sha512 }
  }

  genExifData(fullName, exifInfo) {
    if (exifInfo) {
      const orgExifJson = JSON.stringify(exifInfo)
      const imageSize = JSON.stringify(_.get(exifInfo, ['imageSize']))
      const GPSTimeStamp = JSON.stringify(_.get(exifInfo, ['tags', 'GPSTimeStamp']))
      const {
        thumbnailOffset,
        thumbnailLength,
        thumbnailType,
        app1Offset,
        Make,
        Model,
        Orientation,
        XResolution,
        YResolution,
        ResolutionUnit,
        Software,
        ModifyDate,
        YCbCrPositioning,
        ExposureTime,
        FNumber,
        ExposureProgram,
        ISO,
        DateTimeOriginal,
        CreateDate,
        CompressedBitsPerPixel,
        ShutterSpeedValue,
        ApertureValue,
        ExposureCompensation,
        MaxApertureValue,
        MeteringMode,
        Flash,
        FocalLength,
        SubSecTime,
        ColorSpace,
        ExifImageWidth,
        ExifImageHeight,
        ExposureIndex,
        SensingMethod,
        CustomRendered,
        ExposureMode,
        WhiteBalance,
        DigitalZoomRatio,
        FocalLengthIn35mmFormat,
        SceneCaptureType,
        GainControl,
        Contrast,
        Saturation,
        Sharpness,
        SubjectDistanceRange,
        InteropIndex,
        GPSLatitudeRef,
        GPSLatitude,
        GPSLongitudeRef,
        GPSLongitude,
        GPSAltitudeRef,
        GPSAltitude,
        GPSProcessingMethod,
        GPSDateStamp,
        SubSecTimeDigitized,
        SubSecTimeOriginal,
        BrightnessValue,
      } = _.get(exifInfo, ['tags'])
      return {
        fullName,
        orgExifJson,
        imageSize,
        GPSTimeStamp,
        thumbnailOffset,
        thumbnailLength,
        thumbnailType,
        app1Offset,
        Make,
        Model,
        Orientation,
        XResolution,
        YResolution,
        ResolutionUnit,
        Software,
        ModifyDate,
        YCbCrPositioning,
        ExposureTime,
        FNumber,
        ExposureProgram,
        ISO,
        DateTimeOriginal,
        CreateDate,
        CompressedBitsPerPixel,
        ShutterSpeedValue,
        ApertureValue,
        ExposureCompensation,
        MaxApertureValue,
        MeteringMode,
        Flash,
        FocalLength,
        SubSecTime,
        ColorSpace,
        ExifImageWidth,
        ExifImageHeight,
        ExposureIndex,
        SensingMethod,
        CustomRendered,
        ExposureMode,
        WhiteBalance,
        DigitalZoomRatio,
        FocalLengthIn35mmFormat,
        SceneCaptureType,
        GainControl,
        Contrast,
        Saturation,
        Sharpness,
        SubjectDistanceRange,
        InteropIndex,
        GPSLatitudeRef,
        GPSLatitude,
        GPSLongitudeRef,
        GPSLongitude,
        GPSAltitudeRef,
        GPSAltitude,
        GPSProcessingMethod,
        GPSDateStamp,
        SubSecTimeDigitized,
        SubSecTimeOriginal,
        BrightnessValue,
      }
    } else {
      return null
    }
  }

  getBaseData(fullName, state, imageType) {
    const dirname = path.dirname(fullName)
    const basename = path.basename(fullName)
    const { size, atimeMs, mtimeMs, ctimeMs, birthtimeMs, atime, mtime, ctime, birthtime } = state
    return { fullName, dirname, basename, imageType, size, atimeMs, mtimeMs, ctimeMs, birthtimeMs, atime, mtime, ctime, birthtime }
  }

  async processSaveData(fullName, state) {
    const buffer = fs.readFileSync(fullName)
    const [imageType, md5, sha1, sha256, sha512] = await Promise.all([
      tools.getImageType(buffer),
      ...['md5', 'sha1', 'sha256', 'sha512'].map(type => tools.genCrypto(buffer, type)),
    ])
    const hashInfo = { md5, sha1, sha256, sha512 }
    const exifInfo = imageType ? await tools.getExif(buffer) : null

    return {
      PhotoBaseInfoRepository: { save: this.getBaseData(fullName, state, imageType) },
      PhotoExifRepository: { save: this.genExifData(fullName, exifInfo) },
      PhotoHashInfoRepository: { save: this.genHashData(fullName, hashInfo) },
    }
  }

  async processDeleteData(fullName) {
    return {
      PhotoBaseInfoRepository: { delete: fullName },
      PhotoExifRepository: { delete: fullName },
      PhotoHashInfoRepository: { delete: fullName },
    }
  }

  async DoWork(input, taskId) {
    const { data: { event, path, state } } = input
    switch (event) {
      case 'add':
      case 'change':
        return { data: await this.processSaveData(path, state) }
      case 'unlink':
        return { data: await this.processDeleteData(path) }
      default:
        return null
    }
  }
}

module.exports = GetDetailInfoWorker
