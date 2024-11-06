const express = require('express')
const router = express.Router()

const productRouter = require('./productRouter')
const adminPageRouter = require('./adminPageRouter')

const checkAdminMiddleware = require('../../app/middleware/admin/checkAdminMiddleware')

router.use(checkAdminMiddleware)
router.use('/products', productRouter)
router.use('/', adminPageRouter)

module.exports = router