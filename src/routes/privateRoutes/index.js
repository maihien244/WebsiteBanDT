const express = require('express')
const router = express.Router()

const inforRouter = require('./inforRouter')
const editInforRouter = require('./editInforRouter')
const changeAvatarRouter = require('./changeAvatarRouter')
const productRouter = require('./productRouter')

const checkUserLoginMiddleware = require('../../app/middleware/private/checkUserLoginMiddleware')

router.use(checkUserLoginMiddleware)
router.use('/edit-information', editInforRouter)
router.use('/change-avatar', changeAvatarRouter)
router.use('/products', productRouter)
router.use('/infor', inforRouter)

module.exports = router