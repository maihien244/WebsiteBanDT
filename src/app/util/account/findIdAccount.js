const Account = require('../../model/Account')

module.exports = async (email, phoneNumber) => {
    try {
        if(email != undefined) {
            const account = await Account.findOne({
                email,
            })
            return account._id
        } else {
            const account = await Account.findOne({
                phoneNumber,
            })
            return account._id
        }
    } catch(err) {
        throw new Error ({
            message: 'Fail find id account',
            type: 'error',
            err,
        })
    }
}