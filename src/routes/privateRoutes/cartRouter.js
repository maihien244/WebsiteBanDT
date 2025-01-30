const express = require('express')
const router = express.Router()

const cartController = require('../../app/controller/private/cartController')

const SortMiddleware = require('../../app/middleware/SortMiddleware')

// console.log(2)
router.patch('/', cartController.addProductToCart)
router.patch('/:idCart/delete', cartController.deleteProductInCart)
router.patch('/:list/deleteList', cartController.deleteProductsInCart)
router.get('/', SortMiddleware, cartController.getCartPage)

module.exports = router