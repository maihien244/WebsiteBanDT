const jwt = require('jsonwebtoken')

const copyObject = require('../util/copyObject')
const { toObjectLiteral } = require('../util/convertToObjectLiteral')


const Account = require('../model/Account')
const User = require('../model/User')
const Config = require('../model/ConfigUser')

const configH = require('../../config/handlebars/configHeader')

const checkTokenExpMiddleware = require('./checkTokenExpMiddleware')

module.exports = async function userLoginMiddleware(req, res, next) {
    const configHeader = copyObject(configH)
    try {
        if(!!req.cookies.at) {
            const decoded = await jwt.verify(req.cookies.at, process.env.PUBLIC_KEY, { algorithms: 'HS256'})
            configHeader.userLogin = true
            const account = await Account.findById(decoded.id)
            const config = await Config.findById(decoded.id)
            const wishlist_count = config?.wishlist_count || 0
            const cart_count = config?.cart_count || 0
            const cart_price = config?.cart.reduce((sum, item) => {
                return sum + item.total_amount
            }, 0)
            // console.log(cart_price)
            // console.log(parseFloat(cart_price).toFixed(2))
            const user = toObjectLiteral(await User.findById(decoded.id))
            const userInfor = {
                id: account._id,
                role: account.role,
                avatar: account.avatar,
                email: account.email,
                phoneNumber: account.phoneNumber,
                wishlist_count,
                cart_count,
                cart_price: (cart_price) ? parseFloat(cart_price).toFixed(2): 0,
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
        console.log('loi o at userlogin cap lai')
        console.log(err)
        res.locals.configHeader = copyObject(configH)
        next()
    }
}