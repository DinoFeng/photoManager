const _ = require('lodash')
const BaseRepository = require('./iRepository')
const _createTable = Symbol('createTable')
const _createUniqueIndex = Symbol('createUniqueIndex')
const _createDirNameIndex = Symbol('_createDirNameIndex')
class PhotoBaseInfoRepository extends BaseRepository {
  get tableName() {
    return 'PhotoBaseInfo'
  }

  async InitTable() {
    return this[_createTable]()
      .then(() => Promise.all([
        this[_createUniqueIndex](),
        this[_createDirNameIndex](),
      ]))
      .then(() => true)
  }

  async [_createTable]() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL UNIQUE,
        dirname TEXT,
        basename TEXT,
        rootdir TEXT,
        size INTEGER,
        atimeMs NUMERIC,
        mtimeMs NUMERIC,
        ctimeMs NUMERIC,
        birthtimeMs NUMERIC,
        atime TEXT,
        mtime TEXT,
        ctime TEXT,
        birthtime TEXT,
        active TEXT,
        updatedAt TEXT)`
    return this.dao.run(sql)
  }

  async [_createUniqueIndex]() {
    const sql = `
      CREATE UNIQUE INDEX IF NOT EXISTS idx_${this.tableName}_unique ON ${this.tableName}(fullName)`
    return this.dao.run(sql)
  }

  async [_createDirNameIndex]() {
    const sql = `
      CREATE INDEX IF NOT EXISTS idx_${this.tableName}_dirname ON ${this.tableName}(dirname)`
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
