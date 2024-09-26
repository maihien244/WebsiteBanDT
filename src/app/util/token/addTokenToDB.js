const Token = require('../../model/Token')
const Account = require('../../model/Account')

module.exports = async function (id, email, refreshToken) {
    try {
        if(id == undefined) {
            const account = await Account.findOne({ email })
            id = account._id       
        }
        await Token.create({
            id,
            refreshToken,
        })
    } catch(err) {
        throw new Error ({
            messsage: 'loi add dtbs',
            type: 'error',
            err,
        })
    }
}