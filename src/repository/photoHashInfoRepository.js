const _ = require('lodash')
const BaseRepository = require('./iRepository')

const _createTable = Symbol('createTable')
const _createUniqueIndex = Symbol('createUniqueIndex')
const _createHashIndex = Symbol('_createHashIndex')
class PhotoHashInfoRepository extends BaseRepository {
  get tableName() {
    return 'PhotoHashInfo'
  }

  async InitTable() {
    return this[_createTable]()
      .then(() => Promise.all([
        this[_createUniqueIndex](),
        this[_createHashIndex](),
      ]))
      .then(() => true)
  }

  async [_createTable]() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL UNIQUE,
        md5 TEXT,
        sha1 TEXT,
        sha256 TEXT,
        sha512 TEXT,
        active TEXT,
        updatedAt TEXT)`
    return this.dao.run(sql)
  }

  async [_createUniqueIndex]() {
    const sql = `
      CREATE UNIQUE INDEX IF NOT EXISTS idx_${this.tableName}_unique ON ${this.tableName}(fullName)`
    return this.dao.run(sql)
  }

  async [_createHashIndex]() {
    const sql = `
      CREATE INDEX IF NOT EXISTS idx_${this.tableName}_hash ON ${this.tableName}(md5, sha1, sha256, sha512)`
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
module.exports = PhotoHashInfoRepository
