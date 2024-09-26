const express = require('express')
const router = express.Router()

const getUserController = require('../../app/controller/getUserController')

router.get('/', getUserController.getUserLogin)

module.exports = router