/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Note: This file is used for both PRODUCTION & DEVELOPMENT.
 * Note: Changes to this file (but not any file it imports!) are picked up by the
 * development server, but such updates are costly since the dev-server needs a reboot.
 */
const logMiddleware = require('./middleware/logger.middleware')
const bodyParser = require('body-parser')
const AdoAccess = require('./util/adoAccess')
const imagesInfoRouter = require('./api/images')
const { logger } = require('./util/logger')

module.exports.extendApp = function ({ app, ssr }) {
  /*
     Extend the parts of the express app that you
     want to use with development server too.

     Example: app.use(), app.get() etc
  */
  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(logMiddleware)

  app.locals.adoAccess = new AdoAccess()
  app.use((req, res, next) => {
    req.getADO = async (dbFile) => {
      const adoAccess = app.locals.adoAccess
      if (adoAccess.dbFile !== dbFile) {
        return await adoAccess.init(dbFile)
        // logger.debug('y:', y)
        // return y
      } else {
        return adoAccess.getADO()
        // logger.debug('x:', x)
        // return x
      }
    }
    next()
  })

  app.use('/api', imagesInfoRouter)
}
