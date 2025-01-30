const express = require('express')
const router = express.Router()

const wishListController = require('../../app/controller/private/wishListController')

const SortMiddleware = require('../../app/middleware/SortMiddleware')

// console.log(2)
router.patch('/:id/delete', wishListController.deleteProductInWishList)
router.patch('/:list/deleteList', wishListController.deleteProductsInWishList)
router.post('/:id/add', wishListController.addProductToWishList)
router.get('/', SortMiddleware, wishListController.showWishList)

module.exports = router