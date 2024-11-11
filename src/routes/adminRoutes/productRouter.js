const express = require('express')
const router = express.Router()

const productController = require('../../app/controller/admin/productController')
const SortMiddleware = require('../../app/middleware/SortMiddleware')

router.get('/create', productController.getCreateProductPage)
router.post('/create', productController.createProduct)
router.patch('/:id/edit/:option', productController.editProduct)
router.delete('/:list/deleteList', productController.deleteListProducts)
router.delete('/:id/delete', productController.deleteProduct)
router.get('/:id', productController.getInforProduct)
router.get('/', SortMiddleware, productController.getProducts)

module.exports = router