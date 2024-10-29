const jwt = require('jsonwebtoken')

const Account = require('../../model/Account')

const secondsPerHour = 60*60

module.exports = async (id, email, exp) => {
    // console.log('token confer')
    try {
        if(id == undefined) {
            const account = await Account.findOne({ email })
            id = account._id
        }
        
        const accessToken = await jwt.sign({
            id,
            exp: Math.floor(Date.now()/1000) + 10*60,
        }, process.env.PUBLIC_KEY, {
            algorithm: 'HS256',
        })
        const refreshToken = await jwt.sign({
            id,
            exp: exp || Math.floor(Date.now()/1000) + 5*24*secondsPerHour,
        }, process.env.PRIMARY_KEY, {
            algorithm: 'HS256',
        })
        return {
            accessToken,
            refreshToken,
        }
    } catch(err) {
        throw new Error ({
            type: 'error',
            message: 'loi confor',
            err,
        })
    }
}