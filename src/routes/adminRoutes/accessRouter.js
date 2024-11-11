const express = require('express')
const router = express.Router()

const accessController = require('../../app/controller/admin/accessController')

const SortMiddleware = require('../../app/middleware/SortMiddleware')

router.get('/', SortMiddleware, accessController.getAccountPage)
router.patch('/:id/edit/:option', accessController.editAccount)
router.delete('/:id/delete', accessController.deleteAccount)
router.delete('/:list/deleteList', accessController.deleteListAccount)
router.get('/:id', accessController.getAccount)
module.exports = router