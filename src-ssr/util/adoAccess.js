const DAO = require('../repository/dao')
const _dao = Symbol('_dao')
const _dbFile = Symbol('_dbFile')
class AdoAccess {
  constructor() {
    this[_dbFile] = null
    this[_dao] = null
  }

  getADO() {
    return this[_dao]
  }

  get dbFile() {
    return this[_dbFile]
  }

  async init(dbFile) {
    this[_dbFile] = dbFile
    this[_dao] = await new DAO(dbFile)
    return this.getADO()
  }
}

module.exports = AdoAccess
