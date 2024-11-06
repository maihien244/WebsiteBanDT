const express = require('express')
const router = express.Router()

const adminController = require('../../app/controller/admin/adminController')
// console.log(2)
router.get('/', adminController.getAdminPage)

module.exports = router