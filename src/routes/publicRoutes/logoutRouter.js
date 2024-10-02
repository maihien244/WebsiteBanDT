const express = require('express')
const router = express.Router()

const logoutController = require('../../app/controller/logoutController')

router.get('/', logoutController.logoutAccount)

module.exports = router