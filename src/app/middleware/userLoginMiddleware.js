const jwt = require('jsonwebtoken')

const copyObject = require('../util/copyObject')

const Account = require('../model/Account')
const configH = require('../../config/handlebars/configHeader')

const checkTokenExpMiddleware = require('./checkTokenExpMiddleware')

module.exports = async function userLoginMiddleware(req, res, next) {
    const configHeader = copyObject(configH)
    try {
        if(!!req.cookies.at || !!req.cookies.rt) {
            const decoded = await jwt.verify(req.cookies.at, process.env.PUBLIC_KEY, { algorithms: 'HS256'})
            configHeader.userLogin = true
            const account = await Account.findById(decoded.id)
            const user = {
                id: account.id,
                role: account.role,
                fullname: account.fullname,
            }
            configHeader.user = user
            res.locals.configHeader = configHeader
        } else {
            res.locals.configHeader = configHeader
        }
        next()
    } catch(err) {
        res.locals.configHeader = copyObject(configH)
        res.redirect('/')
    }
}