import _ from 'lodash'

const tools = {
  trimEndStr(v, s) {
    const reg = RegExp(`^(.*)${s}$`, 'i')
    return _.replace(v, reg, '$1')
  },
}
module.exports = tools
export default tools
