const amqp = require('amqplib')
const _ = require('lodash')
const { log4js } = require('./logger')
const logger = log4js.getLogger('Rabbit')

const _log = Symbol('log')
const _connection = Symbol('_connection')
const _hostName = Symbol('_hostName')
const _mqAddress = Symbol('_mqAddress')
class Rabbit {
  constructor({ address, hostName }) {
    this[_hostName] = hostName
    this[_mqAddress] = address
    this[_log] = logger
    return Rabbit.createConnection({ address, hostName })
      .then(cnn => {
        this[_connection] = cnn
      })
      .then(() => this)
  }

  get log() {
    return this[_log]
  }

  get hostName() {
    return this[_hostName]
  }

  get address() {
    return this[_mqAddress]
  }

  get connection() {
    return this[_connection]
  }

  // async assertQueue(queue) {
  //   const channel = await this[_connection].createChannel()
  //   return channel.assertQueue(queue).then(ok => {
  //     return channel
  //   })
  // }

  static async createConnection({ address, hostName }) {
    return amqp.connect(address, { clientProperties: { connection_name: hostName } })
  }

  static async getBalanceQueue(queueList, channel) {
    const queuesInfo = await Promise.all(queueList.map(async queue => {
      try {
        return await channel.checkQueue(queue)
      } catch (e) {
        logger.error(e)
      }
    }))
    // logger && logger.trace(queuesInfo)
    const [a, b] = await Promise.all([
      _.get(queuesInfo
        .filter(v => v)
        .sort((a, b) => a.messageCount - b.messageCount), 0),
      _.get(queuesInfo
        .filter(v => v)
        .filter(v => v.consumerCount > 0)
        .sort((a, b) => a.messageCount - b.messageCount), 0),
    ])
    // logger && logger.trace({ a, b })
    const { queue } = b || a || {}
    return queue
  }

  static async getBalanceQueueWithSafe(queueList, channel) {
    const queuesInfo = await Promise.all(queueList.map(async queue => {
      try {
        return await channel.assertQueue(queue)
      } catch (e) {
        logger.error(e)
      }
    }))
    // logger && logger.trace(queuesInfo)
    const [a, b] = await Promise.all([
      _.get(queuesInfo
        .filter(v => v)
        .sort((a, b) => a.messageCount - b.messageCount), 0),
      _.get(queuesInfo
        .filter(v => v)
        .filter(v => v.consumerCount > 0)
        .sort((a, b) => a.messageCount - b.messageCount), 0),
    ])
    // logger && logger.trace({ a, b })
    const { queue } = b || a || {}
    return queue
  }
}

module.exports = Rabbit
