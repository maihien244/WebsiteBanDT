const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.json('login')
})

router.post('/', (rew, res, next) => {

})

module.exports = router