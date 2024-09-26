const express = require('express')
const router = express.Router()

const registerController = require('../../app/controller/registerController')
const existsAccountMiddle = require('../../app/middleware/existsAccountMiddleware')

router.get('/', registerController.showRegisterPage)

router.post('/',existsAccountMiddle, registerController.createAccount)

module.exports = router