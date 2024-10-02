const express = require('express')
const router = express.Router()

const inforRouter = require('./inforRouter')

const checkUserLoginMiddleware = require('../../app/middleware/private/checkUserLoginMiddleware')

router.use(checkUserLoginMiddleware)
console.log(1)
router.use('/infor', inforRouter)

module.exports = router