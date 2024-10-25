const express = require('express')
const router = express.Router()

const productController = require('../../app/controller/private/productController')
const SortMiddleware = require('../../app/middleware/SortMiddleware')

router.delete('/:id', productController.deleteProduct)
router.get('/', SortMiddleware, productController.getProducts)

module.exports = router