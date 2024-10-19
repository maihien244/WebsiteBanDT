const express = require('express')
const router = express.Router()

const editInforController = require('../../app/controller/private/editInforController')
// console.log(2)
router.patch('/', editInforController.editInfor)

module.exports = router