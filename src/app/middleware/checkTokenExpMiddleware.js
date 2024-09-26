const jwt = require('jsonwebtoken')

const conferToken = require('../util/token/conferToken')
const updateRefreshToken = require('../util/token/updateRefreshToken')
const setCookie = require('../util/token/setCookie')

module.exports = async (req, res, next) => {
    console.log('check token 1')
    const accessToken = req.cookies.at
    const refreshToken = req.cookies.rt
    try {
        const decode = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithm: 'HS256'})
        console.log('check token 2')
        next()
    } catch(err) {
        try {
            const decode = jwt.verify(refreshToken, process.env.PRIMARY_KEY, { algorithm: 'HS256'})
            const token = await conferToken(decode.id, undefined, decode.exp)
            await updateRefreshToken(decode.id, token.refreshToken)
            setCookie(res, token)
            console.log('check token 3')    
            next()
        } catch(err) {
            res.redirect('/login')
        }
    }
}