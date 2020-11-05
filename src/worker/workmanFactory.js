const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const workmans = fs.readdirSync(path.resolve(__dirname))
  .filter(item => _.endsWith(item, '.js'))
  .map(item => _.trimEnd(item, '.js'))
  .filter(item => !['workmanFactory', 'iWorkman'].includes(item))
  .reduce((pre, filename) => {
    return _.merge(pre, { [`${_.upperFirst(filename)}`]: require(path.resolve(__dirname, filename)) })
  }, {})

const assignWorker = (workType) => {
  const Workman = workmans[workType]
  const w = new Workman()
  return w
}

module.exports = { assignWorker }
