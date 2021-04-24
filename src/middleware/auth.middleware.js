const _ = require('lodash')
const { logger } = require('../util/logger')
const jwt = require('jsonwebtoken')

const authHelper = async (req, res, next) => {
  // logger.info('Checking...login')
  // setTimeout(function() {next()},  1000);
  try {
    const authorization = _.get(req, ['headers', 'authorization'], '')
    // logger.debug({ authorization });
    const auth = authorization.split(' ')

    const tokenStr = auth[0].toLowerCase() === 'bearer' ? auth[1] : auth[0]
    // logger.debug({ tokenStr });

    if (tokenStr) {
      req.token = tokenStr
      const profile = jwt.decode(tokenStr)
      const email = _.get(profile, ['unique_name'])
      const userNt = email.split('@')[0].toLowerCase()
      const givenName = _.get(profile, ['given_name'])
      const familyName = _.get(profile, ['family_name'])
      // const getGenUserInfo = async () => fetchTableFind('genUsers', { user_id: userNt })
      // const getGenDepartmentInfo = async () => {
      //   const userInfo=await
      // };
      req.userInfo = {
        profile,
        email,
        userNt,
        userName: `${givenName} ${familyName}`,
        getRoles: async () => {
          // const model = new CommonService('authorization')
          // const data = await model.findOne({ userNt })
          // return _.get(data, ['roles'])
        },
        // getGenUserInfo,
        // getGenDepartmentInfo,
      }
      // logger.debug(req.userInfo);
    }
  } catch (err) {
    logger.error(err)
  }
  next()
}

module.exports = authHelper
export default authHelper
