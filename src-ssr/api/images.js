const express = require('express')
const router = express.Router()
const { formatJson, sendFile } = require('./api')
const dbFile = '\\\\192.168.0.187\\LiveRecords\\My Photos\\photoLib.db'

// router.get('/test', (req, res) => {
//   res.sendFile()
// })

router.get('/hello/:name', formatJson(async (req, res) => {
  // const PhotoBaseInfoRepository = require('../repository/photoBaseInfoRepository')
  const { params } = req
  const { name } = params
  // throw new Error(`My name is't ${name}`)
  // const ado = await req.getADO(dbFile)
  // const photo = await new PhotoBaseInfoRepository(ado)
  // const data = await photo.get({ fullName: { like: '%' } })
  // return `hello ${JSON.stringify(data)}!`
  return `hello ${name}!`
}))

router.get('/hello', sendFile(async (req, res) => {
  const PhotoBaseInfoRepository = require('../repository/photoBaseInfoRepository')
  // const { params } = req
  // const { name } = params
  // throw new Error(`My name is't ${name}`)
  const ado = await req.getADO(dbFile)
  const photo = await new PhotoBaseInfoRepository(ado)
  const data = await photo.get({ fullName: { like: '%' } })
  // return `hello ${JSON.stringify(data)}!`
  if (data) {
    // res.sendFile(data.fullName)
    return data.fullName
  } else {
    // res.status(404)
    return null
  }
  // return `hello ${name}!`
}))

module.exports = router
