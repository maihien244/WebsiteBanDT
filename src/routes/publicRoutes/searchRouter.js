const express = require('express')
const router = express.Router()

const searchController = require('../../app/controller/searchController')

router.post('/', searchController.search)

module.exports = router