const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('partials/component/public/register')
})

router.post('/', (rew, res, next) => {

})

module.exports = router