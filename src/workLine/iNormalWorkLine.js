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
        this.log.info(result)
        // 广播返回Result
        if (this.exportExchange) {
          try {
            await channel.publish(this.exportExchange, '', Buffer.from(JSON.stringify(result)), { persistent: true })
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
