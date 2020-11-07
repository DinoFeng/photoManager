const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const workLines = fs.readdirSync(path.resolve(__dirname))
  .filter(item => _.endsWith(item, '.js'))
  .map(item => _.trimEnd(item, '.js'))
  .filter(item => !['workLineFactory', 'iWorkLine', 'iNormalWorkLine', 'iAdoWorkLine'].includes(item))
  .reduce((pre, filename) => {
    return _.merge(pre, { [`${_.upperFirst(filename)}`]: require(path.resolve(__dirname, filename)) })
  }, {})

const assignWorlLine = (queueName, name) => {
  // console.debug(workLines)
  const WorkLine = workLines[queueName]
  const w = new WorkLine(name)
  return w
}

module.exports = { assignWorlLine }
