const jwt = require('jsonwebtoken')

const Token = require('../model/Token')

const conferToken = require('../util/token/conferToken')
const updateRefreshToken = require('../util/token/updateRefreshToken')
const setCookie = require('../util/token/setCookie')

module.exports = async (req, res, next) => {
    const accessToken = req.cookies.at
    const refreshToken = req.cookies.rt
    if(!!refreshToken) {
        try {
            const decode = await jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithm: 'HS256'})
            res.locals.id = decode.id
            next()
        } catch(err) {
            try {
                const decode = await jwt.verify(refreshToken, process.env.PRIMARY_KEY, { algorithm: 'HS256'})
                await Token.findOneAndDelete({refreshToken})
                const token = await conferToken(decode.id, undefined, decode.exp)
                await updateRefreshToken(decode.id, token.refreshToken)
                setCookie(res, token)  
                next()
            } catch(err) {
                next()
            }
        }
    } else {
        next()
    }
}