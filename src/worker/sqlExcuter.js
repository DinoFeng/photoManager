// const _ = require('lodash')
const BaseWorkman = require('./iWorkman')

class SqlExcuter extends BaseWorkman {
  // get actions() {
  //   return {
  //     save: async (repository, data) => repository.save(data),
  //     delete: async (repository, data) => repository.delete(data),
  //   }
  // }

  async DoWork(input, taskId, repositories) {
    // { table: { action: { data } } }
    const { data } = input
    // this.log.debug(input, data)
    if (data) {
      return await Promise.all(Object.keys(data).map(k => {
        const repository = repositories[k]
        // this.log.debug(data, k, data[k], repository)
        if (repository) {
          const actionDatas = data[k]
          return Promise.all(Object.keys(actionDatas).map(action => {
            // this.log.debug(actionDatas, action, actionDatas[action])
            return actionDatas[action] ? repository[action](actionDatas[action]).then(() => `${k}.${action} Done.`) : null
            // return this.actions[action](repository, actionDatas[action])
          }))
        } else {
          return null
        }
      }))
    }
  }
}

module.exports = SqlExcuter
