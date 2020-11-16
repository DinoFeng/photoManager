const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const repositories = fs.readdirSync(path.resolve(__dirname))
  .filter(item => _.endsWith(item, '.js'))
  .map(item => _.trimEnd(item, '.js'))
  .filter(item => !['repositoryFactory', 'iRepository', 'dao'].includes(item))
  .reduce((pre, filename) => {
    return _.merge(pre, { [`${_.upperFirst(filename)}`]: require(path.resolve(__dirname, filename)) })
  }, {})

// const assignRepository = (tableName) => {
//   return repositories[tableName]
// }

module.exports = { repositories }
