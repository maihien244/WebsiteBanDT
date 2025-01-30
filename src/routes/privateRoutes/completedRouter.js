const express = require('express')
const router = express.Router()

const completedController = require('../../app/controller/private/completedController')

const SortMiddleware = require('../../app/middleware/SortMiddleware')

// console.log(2)
router.get('/', SortMiddleware, completedController.getCompletedOrder)

module.exports = router