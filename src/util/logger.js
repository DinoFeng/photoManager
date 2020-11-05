// ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF - note that OFF is intended to be used to turn off logging, not as a level for actual logging, i.e. you would never call logger.off('some log message')
const _ = require('lodash')
const log4js = require('log4js')
const toFileLevel = ['info', 'warn', 'error', 'fatal', 'mark']
const fileAppenders = toFileLevel.map(level => `to${_.upperFirst(level)}File`)
const fileConfig = {
  type: 'multiFile',
  base: 'logs/',
  property: 'categoryName',
  pattern: 'yyyy-MM-dd.{level}',
  alwaysIncludePattern: true,
  extension: '.log',
  keepFileExt: true,
}
const fileAppendersConfigs = toFileLevel.reduce((pre, level) => {
  const f = `${level}File`
  return _.merge(pre, {
    [`to${_.upperFirst(level)}File`]: {
      type: 'logLevelFilter',
      appender: f,
      level,
      maxLevel: level,
    },
    [f]: _.merge({}, fileConfig, { pattern: `yyyy-MM-dd.${level}` }),
  })
}, {})
const appendersConfig = _.merge({ console: { type: 'console' } }, fileAppendersConfigs)
const config = {
  appenders: appendersConfig,
  categories: {
    default: {
      appenders: [...fileAppenders, 'console'],
      level: process.env.loggerLevel || 'ALL',
    },
  },
}
// console.info(JSON.stringify(config, null, 2))
// console.info(config)
log4js.configure(config)
// log4js.configure({
//   appenders: {
//     console: {
//       type: 'console',
//     },
//     // file: {
//     //   type: 'dateFile',
//     //   filename: 'logs2/spider2',
//     //   alwaysIncludePattern: true,
//     //   pattern: '.yyyy-MM-dd.log',
//     //   // keepFileExt: true,
//     //   daysToKeep: 3,
//     // },
//     file: {
//       type: 'multiFile',
//       base: 'logs/',
//       property: 'categoryName',
//       pattern: 'yyyy-MM-dd',
//       alwaysIncludePattern: true,
//       extension: '.log',
//       keepFileExt: true,
//     },
//     markFile: {
//       type: 'multiFile',
//       base: 'logs/',
//       property: 'categoryName',
//       pattern: 'yyyy-MM-dd.mark',
//       alwaysIncludePattern: true,
//       extension: '.log',
//       keepFileExt: true,
//     },
//     fatalFile: {
//       type: 'multiFile',
//       base: 'logs/',
//       property: 'categoryName',
//       pattern: 'yyyy-MM-dd.fatal',
//       alwaysIncludePattern: true,
//       extension: '.log',
//       keepFileExt: true,
//     },
//     errorFile: {
//       type: 'multiFile',
//       base: 'logs/',
//       property: 'categoryName',
//       pattern: 'yyyy-MM-dd.error',
//       alwaysIncludePattern: true,
//       extension: '.log',
//       keepFileExt: true,
//     },
//     warnFile: {
//       type: 'multiFile',
//       base: 'logs/',
//       property: 'categoryName',
//       pattern: 'yyyy-MM-dd.warn',
//       alwaysIncludePattern: true,
//       extension: '.log',
//       keepFileExt: true,
//     },
//     infoFile: {
//       type: 'multiFile',
//       base: 'logs/',
//       property: 'categoryName',
//       pattern: 'yyyy-MM-dd.info',
//       alwaysIncludePattern: true,
//       extension: '.log',
//       keepFileExt: true,
//     },
//     toMarkFile: {
//       type: 'logLevelFilter',
//       appender: 'markFile',
//       level: 'MARK',
//       maxLevel: 'MARK',
//     },
//     toFatalFile: {
//       type: 'logLevelFilter',
//       appender: 'fatalFile',
//       level: 'FATAL',
//       maxLevel: 'FATAL',
//     },
//     toErrorFile: {
//       type: 'logLevelFilter',
//       appender: 'errorFile',
//       level: 'ERROR',
//       maxLevel: 'ERROR',
//     },
//     toWarnFile: {
//       type: 'logLevelFilter',
//       appender: 'warnFile',
//       level: 'WARN',
//       maxLevel: 'WARN',
//     },
//     toInfoFile: {
//       type: 'logLevelFilter',
//       appender: 'infoFile',
//       level: 'INFO',
//       maxLevel: 'INFO',
//     },
//   },
//   categories: {
//     default: {
//       appenders: ['toMarkFile', 'toFatalFile', 'toErrorFile', 'toWarnFile', 'toInfoFile', 'console'],
//       level: process.env.loggerLevel || 'ALL',
//     },
//   },
// })
log4js.org_getLogger = log4js.getLogger
const profile = {}
const NS_PER_SEC = 1e9
const MS_PER_SEC = 1e6
log4js.getLogger = category => {
  const l = log4js.org_getLogger(category)
  l.time = name => {
    // console.time(name)
    profile[name] = process.hrtime()
  }
  l.timeEnd = (name, level) => {
    const diff = process.hrtime(profile[name])
    delete profile[name]
    const log = (level || 'info').toLowerCase()
    l[log](`${name}: durationMs = ${(diff[0] * NS_PER_SEC + diff[1]) / MS_PER_SEC} ms`)
    // console.timeEnd(name)
  }
  l.profile = (name, level) => {
    const start = profile[name]
    start ? l.timeEnd(name, level) : l.time(name)
    // if (start) {
    //   l.timeEnd(name, level)
    // } else {
    //   l.time(name)
    // }
  }
  return l
}
const morganLog = log4js.getLogger('morgan')
const loggerStream = {
  write: (message, encoding) => {
    morganLog.info(message)
  },
}

const logger = log4js.getLogger()

module.exports = {
  logger,
  log4js,
  loggerStream,
}
