import { createConnection } from 'typeorm'
import fs from 'fs'
import path from 'path'
// import _ from 'lodash'
import { logger } from '../util/logger'

// const entities = fs
//   .readdirSync(path.resolve(__dirname))
//   .filter((item) => _.endsWith(item, '.js'))
//   .map((item) => tools.trimEndStr(item, '.js'))
//   .filter((item) => !['index'].includes(item))
//   .map((filename) => {
//     return require(path.resolve(__dirname, filename))
//   })

const dbFile = './upload/linex.sqlite.db'

class ConnectionPool {
  constructor() {
    createConnection({
      type: 'better-sqlite3', // 'sqlite',
      database: dbFile,
      // entities,
      entities: [path.join(__dirname, '/entity/*.js')],
      // logging: true,
      busyErrorRetry: true,
      enableWAL: true,
      synchronize: !fs.existsSync(dbFile),
    }).then((c) => {
      logger.debug('connected.')
      this.connection = c
    })
  }

  async test() {
    const c = this.connection
    const r = c.getRepository()
    r.findOne({})
    // const runner = c.createQueryRunner()
    // await runner.connect()
    // runner.manager.save<>({}, { reload: true })
    // const baseRep = c.getRepository('PhotoBase')
    // c.manager.getRepository()

    // runner.startTransaction()
    // runner.commitTransaction
    // runner.rollbackTransaction()
    // runner.manager.save<'PhotoBase'>()
  }

  getConnection() {
    if (!this.connection.isConnected) {
      this.connection.connect()
    }
    return this.connection
  }

  closeConnection() {
    this.connection.close()
  }
}

module.exports = ConnectionPool
export default ConnectionPool
