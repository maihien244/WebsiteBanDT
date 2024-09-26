const express = require('express')
const router = express.Router()

const loginController = require('../../app/controller/loginController')
const validInputMiddleware = require('../../app/middleware/validInputMiddleware')

router.get('/', loginController.showLoginPage)

router.post('/', validInputMiddleware.isEmailOrPhoneNumber, loginController.loginAccount)

module.exports = router