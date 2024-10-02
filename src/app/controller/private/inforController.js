const jwt = require('jsonwebtoken')

const Account = require('../../model/Account')

const { toObjectLiteral } = require('../../util/convertToObjectLiteral')

class InforController {
    //[get] private/infor
    async getInfor(req, res, next) {
        console.log(3)
        try {
            const decoded = await jwt.verify(req.cookies.at, process.env.PUBLIC_KEY, { algorithms: 'HS256'})
            const account = toObjectLiteral(await Account.findOne({
                _id: decoded.id
            }))
            console.log('infor')
            console.log(account)
            
            res.render('partials/component/private/inforUser', {
                configHeader: res.locals.configHeader,
                userInfor: {
                    fullname: account.fullname,
                    email: account.email,
                    phoneNumber: account.phoneNumber,
                    avatar: account.avatar,
                },
            })

        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Server get information user fail!',
                err,
            })
        }
    } 
}

module.exports = new InforController