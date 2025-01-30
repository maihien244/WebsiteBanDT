const express = require('express')
const router = express.Router()

const canceledController = require('../../app/controller/private/canceledController')

const SortMiddleware = require('../../app/middleware/SortMiddleware')

// console.log(2)
// router.patch('/', cartController.addProductToCart)
router.patch('/:idCart/:idPd/restore', canceledController.restoreProductInCart)
router.patch('/:list/restoreList', canceledController.restoreProductsInCart)
router.get('/', SortMiddleware, canceledController.getCanceledPage)

module.exports = router