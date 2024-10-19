const jwt = require('jsonwebtoken')

const copyObject = require('../util/copyObject')
const { toObjectLiteral } = require('../util/convertToObjectLiteral')


const Account = require('../model/Account')
const User = require('../model/User')

const configH = require('../../config/handlebars/configHeader')

const checkTokenExpMiddleware = require('./checkTokenExpMiddleware')

module.exports = async function userLoginMiddleware(req, res, next) {
    const configHeader = copyObject(configH)
    try {
        if(!!req.cookies.at || !!req.cookies.rt) {
            const decoded = await jwt.verify(req.cookies.at, process.env.PUBLIC_KEY, { algorithms: 'HS256'})
            configHeader.userLogin = true
            const account = await Account.findById(decoded.id)
            const user = toObjectLiteral(await User.findById(decoded.id))
            const userInfor = {
                id: account._id,
                role: account.role,
                avatar: account.avatar,
                email: account.email,
                phoneNumber: account.phoneNumber,
                ...user,
            }
            configHeader.user = userInfor
            res.locals.configHeader = configHeader
            res.locals.id = account._id
            res.locals.password = account.password
            // console.log(configHeader)
        } else {
            res.locals.configHeader = configHeader
        }
        next()
    } catch(err) {
        res.locals.configHeader = copyObject(configH)
        res.redirect('/')
    }
}