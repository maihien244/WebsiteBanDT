const express = require('express')
const router = express.Router()

const loginController = require('../../app/controller/loginController')
const validInputMiddleware = require('../../app/middleware/validInputMiddleware')

router.post('/check', validInputMiddleware.isEmailOrPhoneNumber, loginController.loginAccount)
router.get('/', loginController.showLoginPage)


module.exports = router