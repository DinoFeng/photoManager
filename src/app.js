const { assignWorlLine } = require('./workLine/workLineFactory')

const createWorkerDoWork = (workerName, queueName) => {
  const myWorker = assignWorlLine(queueName, workerName)
  // myWorker.startConsumer(workerName)
  myWorker.startConsumer(queueName)
}

  ;
(async () => {
  const arg = process.argv.slice(2)
  const [queueName, name] = arg
  console.debug({ queueName, name })
  const workerName = `${queueName}_${name}`
  createWorkerDoWork(workerName, queueName)
  // worker[`${queueName}DoWork`](workerName, queueName)
})()
