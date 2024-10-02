const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    console.log(res.locals.configHeader)
    res.render('home', {
        configHeader: res.locals.configHeader,
    })
})

module.exports = router