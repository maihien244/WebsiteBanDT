const express = require('express')
const router = express.Router()

const inforController = require('../../app/controller/private/inforController')
// console.log(2)
router.get('/', inforController.getInfor)

module.exports = router