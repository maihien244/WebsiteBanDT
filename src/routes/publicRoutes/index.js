const express = require('express')
const router = express.Router()

const homeRouter = require('./homeRouter')
const registerRouter = require('./registerRouter')
const loginRouter = require('./loginRouter')
const getUserRouter = require('./getUserRouter')

const checkTokenExpMiddleware = require('../../app/middleware/checkTokenExpMiddleware')

router.use('/userLogin',checkTokenExpMiddleware, getUserRouter)
router.use('/register', registerRouter)
router.use('/login', loginRouter)
router.get('/home', homeRouter)

module.exports = router