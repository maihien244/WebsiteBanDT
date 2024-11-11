const express = require('express')
const router = express.Router()

const trashController = require('../../app/controller/admin/trashController')
const SortMiddleware = require('../../app/middleware/SortMiddleware')

router.patch('/:id/restore', trashController.restoreProduct)
router.patch('/:list/restoreList', trashController.restoreList)
router.delete('/:id/force', trashController.forceProduct)
router.delete('/:list/forceList', trashController.forceList)
router.get('/', SortMiddleware, trashController.getTrashPage)

module.exports = router