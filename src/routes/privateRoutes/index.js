const express = require('express')
const router = express.Router()

const inforRouter = require('./inforRouter')
const editInforRouter = require('./editInforRouter')
const uploadRouter = require('./uploadRouter')
const wishListRouter = require('../privateRoutes/wishListRouter')
const cartRouter = require('../privateRoutes/cartRouter')
const canceledRouter = require('../privateRoutes/canceledRouter')
const completedRouter = require('../privateRoutes/completedRouter')

const checkUserLoginMiddleware = require('../../app/middleware/private/checkUserLoginMiddleware')

router.use(checkUserLoginMiddleware)
router.use('/edit-information', editInforRouter)
router.use('/change-avatar', uploadRouter)
router.use('/wishlist', wishListRouter)
router.use('/completed', completedRouter)
router.use('/cart', cartRouter)
router.use('/canceled', canceledRouter)
router.use('/infor', inforRouter)

module.exports = router