const express = require('express')
const router = express.Router()

const homeRouter = require('./homeRouter')
const registerRouter = require('./registerRouter')
const loginRouter = require('./loginRouter')
const logoutRouter = require('./logoutRouter')

const checkTokenExpMiddleware = require('../../app/middleware/checkTokenExpMiddleware')

router.use('/register', registerRouter)
router.use('/login', loginRouter)
router.use('/logout', logoutRouter)
router.use('/', homeRouter)

module.exports = router