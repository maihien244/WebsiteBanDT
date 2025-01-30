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
                res.json({
                    type: 'warning',
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
                res.json({
                    type: 'succes'
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
        const idUser = res.locals.id
        const updateResult = req.file
        const message = {}
        if(updateResult != null) {
            await Account.updateOne({
                _id: idUser
            }, {
                avatar: updateResult.path
            })
            message.type = 'success'
            message.message = 'Upload avatar success'
            message.path = updateResult.path
        } else {
            message.type = 'error'
            message.message = 'Upload avatar fail'
        }
        res.json(message)
    }
}

module.exports = new EditInforController