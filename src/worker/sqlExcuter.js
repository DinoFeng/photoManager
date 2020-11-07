// const _ = require('lodash')
const BaseWorkman = require('./iWorkman')
const { repositories } = require('../repository/repositoryFactory')
// const tools = require('../util/tools')
// const fs = require('fs')

class GetHashWorker extends BaseWorkman {
  // get actions() {
  //   return {
  //     save: async (repository, data) => repository.save(data),
  //     delete: async (repository, data) => repository.delete(data),
  //   }
  // }

  async DoWork(input, taskId, ado) {
    const { data } = input
    return Promise.all(Object.keys(data).map(k => {
      const Repository = repositories[k]
      if (Repository) {
        const repository = new Repository(ado)
        const actionDatas = data[k]
        return Promise.all(Object.keys(actionDatas.map(action => {
          return repository[action](actionDatas[action])
          // return this.actions[action](repository, actionDatas[action])
        })))
      } else {
        return null
      }
    }))
  }
}

module.exports = GetHashWorker
