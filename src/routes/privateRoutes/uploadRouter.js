const express = require('express')
const router = express.Router()

const editInforController = require('../../app/controller/private/editInforController')
const uploadCloud = require('../../app/middleware/private/cloudinary')
// console.log(2)
router.patch('/', uploadCloud.single('image'), editInforController.changeAvatar)

module.exports = router