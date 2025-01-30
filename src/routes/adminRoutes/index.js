const express = require('express')
const router = express.Router()

const productRouter = require('./productRouter')
const adminPageRouter = require('./adminPageRouter')
const trashRouter = require('./trashRouter')
const pendingRouter = require('./pendingRouter')
const accessRouter = require('./accessRouter')

const checkAdminMiddleware = require('../../app/middleware/admin/checkAdminMiddleware')

router.use(checkAdminMiddleware)
router.use('/products', productRouter)
router.use('/trash', trashRouter)
router.use('/access-setting', accessRouter)
router.use('/pending', pendingRouter)
router.use('/', adminPageRouter)

module.exports = router