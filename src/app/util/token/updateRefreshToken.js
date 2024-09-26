const { model } = require('mongoose')
const Token = require('../../model/Token')

module.exports = async (id, refreshToken) => {
    try {
        await Token.findByIdAndUpdate(id, { refreshToken })
    } catch(err) {
        throw new Error({
            message: 'Fail upddate refresh token',
            err: err,
        })
    }
}