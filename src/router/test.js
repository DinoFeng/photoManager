import express from 'express'
import { wrapAsync } from '../util/common'
const router = express()

router.get(
  '/',
  wrapAsync((req, res, next) => {
    // res.status(200).json('Hello world!')
    const { hi } = req.query || {}
    if (hi) {
      return `Hello ${hi || 'world'}`
    } else {
      throw new Error('no hi!')
    }
  }),
)

module.exports = router
export default router
