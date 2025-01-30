const express = require('express')
const router = express.Router()

const PendingController = require('../../app/controller/admin/pendingController')

const SortMiddleware = require('../../app/middleware/SortMiddleware')

router.patch('/:idUser/:idCart/confirm', PendingController.confirmOrder)
router.patch('/:idUser/:idCart/success', PendingController.successOrder)
router.delete('/:idUser/:idCart/delete', PendingController.deleteOrder)
router.patch('/:uri/comfirmList', PendingController.confirmListOrder)
router.patch('/:uri/successList', PendingController.successListOrder)
router.delete('/:uri/deleteList', PendingController.deleteListOrder)
router.get('/:idUser', PendingController.getPendingOrderUser)
router.get('/', SortMiddleware, PendingController.getPendingOrder)
// router.patch('/:id/edit/:option', accessController.editAccount)
// router.delete('/:id/delete', accessController.deleteAccount)
// router.delete('/:list/deleteList', accessController.deleteListAccount)
module.exports = router