module.exports = {
  folder: {
    import: 'd:/ttt',
    photo: 'd:/ttt', // '\\\\192.168.0.187\\LiveRecords\\My Photos',
    picture: 'd:/picture',
    other: 'd:/notPhoto',
  },
  photoFolder: {
    organizationStructure: '{YYYY}/{MM}/{DD}',
  },
  othersFolder: {
    organizationStructure: '{FileType}',
  },
  action: 'move',
  exchange: {
    watchImportFolder: '',
    watchPhotoFolder: '',
    exportDetailInfo: '',
    exportNewPath: '',
  },
}
