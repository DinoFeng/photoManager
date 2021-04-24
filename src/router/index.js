import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import tools from '../util/tools'

const router = fs
  .readdirSync(path.resolve(__dirname))
  .filter((item) => _.endsWith(item, '.js'))
  .map((item) => tools.trimEndStr(item, '.js'))
  .filter((item) => !['index'].includes(item))
  .reduce((pre, filename) => {
    return _.merge(pre, { [`${_.upperFirst(filename)}`]: require(path.resolve(__dirname, filename)) })
  }, {})

// const assignWorker = (workType) => {
//   const Workman = workmans[workType]
//   if (Workman) {
//     const w = new Workman()
//     return w
//   }
// }

// module.exports = { assignWorker }
export default router
