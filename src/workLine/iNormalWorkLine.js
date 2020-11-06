const _ = require('lodash')
const BaseWorkLine = require('./iWorkLine')
const { assignWorker } = require('../worker/workmanFactory')

class NormalWorkLine extends BaseWorkLine {
  constructor(workLineName) {
    super({ address: 'amqp://localhost', workLineName })
    if (!this.workerName) {
      throw new Error('workerName not set!')
    }
  }

  get workerName() {
    return null
  }

  async doFeature(msg, channel, taskId) {
    const data = this.parseMessageContent(msg)
    if (data) {
      const worker = assignWorker(this.workerName)
      const result = await worker.DoWork(data, taskId)
      if (result) {
        this.log.info(JSON.stringify(result, null, 2))
        // 广播返回Result
        if (_.get(this.exportExchange, 'name')) {
          try {
            const key = _.isFunction(this.exportExchange.key) ? this.exportExchange.key(msg) : ''
            await channel.publish(this.exportExchange.name, key, Buffer.from(JSON.stringify(result)), { persistent: true })
          } catch (e) {
            this.log.error(e)
          }
        }
        // 或向下级Queue send msg
        if (this.nextQueue) {
          await channel.sendToQueue(this.nextQueue, Buffer.from(JSON.stringify(result)), { persistent: true })
        }
        await channel.ack(msg)
        return true
      } else {
        await channel.reject(msg, false)
        return false
      }
    } else {
      this.deadLineHandling(msg, new Error('Invalid message.'))
      await channel.reject(msg, false)
      return false
    }
  }
}

module.exports = NormalWorkLine
