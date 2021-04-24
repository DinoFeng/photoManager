import _ from 'lodash'
// @flow

const test = async (n: number) => {
  if (!_.isArray(n)) {
    return n * n
  }
}

console.debug(test(5))
