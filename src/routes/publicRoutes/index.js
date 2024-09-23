const express = require('express')
const router = express.Router()

const homeRouter = require('./homeRouter')
const registerRouter = require('./registerRouter')
const loginRouter = require('./loginRouter')

router.use('/register', registerRouter)
router.use('/login', loginRouter)
router.get('/', homeRouter)

module.exports = router