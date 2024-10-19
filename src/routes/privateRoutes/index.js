const express = require('express')
const router = express.Router()

const inforRouter = require('./inforRouter')
const editInforRouter = require('./editInforRouter')
const changeAvatarRouter = require('./changeAvatarRouter')

const checkUserLoginMiddleware = require('../../app/middleware/private/checkUserLoginMiddleware')

router.use(checkUserLoginMiddleware)
console.log(1)
router.use('/edit-information', editInforRouter)
router.use('/change-avatar', changeAvatarRouter)
router.use('/infor', inforRouter)

module.exports = router