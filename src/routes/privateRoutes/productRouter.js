const express = require('express')
const router = express.Router()

const productController = require('../../app/controller/private/productController')
const SortMiddleware = require('../../app/middleware/SortMiddleware')

router.delete('/:list/deleteList', productController.deleteListProducts)
router.delete('/:id/delete', productController.deleteProduct)
router.get('/:id', productController.getInforProduct)
router.get('/', SortMiddleware, productController.getProducts)

module.exports = router