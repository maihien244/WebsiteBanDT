const jwt = require('jsonwebtoken')

const Account = require('../../model/Account')
const User = require('../../model/User')

const { toObjectLiteral } = require('../../util/convertToObjectLiteral')

class EditInforController {
    //[patch] /edit-information
    async editInfor(req, res, next) {
        console.log('edit information')
        const options = req.body

        try {
            if(options.account.current_password != res.locals.password) {
                res.status(300).json({
                    type: 'waring',
                    message: 'The password is incorrect!'
                })
            } else {
                const { current_password, ...newOption} = options.account
                await Account.findByIdAndUpdate(res.locals.id, {
                    ...newOption
                })
                await User.findByIdAndUpdate(res.locals.id, {
                    ...options.user
                })
            }
        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Database fail edit information!'
            })
        }
    }

    async changeAvatar(req, res, next) {
        const newAvatar = req.body.avatar
        try {
            await Account.findByIdAndUpdate(res.locals.id, {
                avatar: newAvatar
            })
            res.status(200).json({
                type: 'success',
                message: 'Update avatar succes'
            })
        } catch(err) {
            res.status(500).json({
                type: 'Error',
                message: 'Dont change your avatar!'
            })
        }
    }
}

module.exports = new EditInforController