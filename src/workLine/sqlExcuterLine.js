const DAO = require('../repository/dao')
const AdoWorkLine = require('./iAdoWorkLine')
const _ = require('lodash')
const path = require('path')
const config = require('../config')
const { repositories } = require('../repository/repositoryFactory')

const _dao = Symbol('_dao')
const _repositories = Symbol('_repositories')
class sqlExcuterLine extends AdoWorkLine {
  get workerName() {
    return 'SqlExcuter'
  }

  get ADO() {
    return this[_dao]
  }

  get repositories() {
    return this[_repositories]
  }

  async beforeConsume() {
    const dbFile = path.join(config.folder.photo, 'photoLib.db')
    const dao = await new DAO(dbFile)
    this[_dao] = dao

    this[_repositories] = await Promise.all(Object.keys(repositories).map(async k => {
      return { [k]: await new repositories[k](dao) }
    })).then(reps => reps.reduce((pre, item) => {
      return _.merge(pre, item)
    }, {}))
  }

  get bindExchange() {
    const name = 'exportPhotoEventDetailInfo'
    return {
      name,
      type: config.exchange[name],
    }
  }
}

module.exports = sqlExcuterLine
