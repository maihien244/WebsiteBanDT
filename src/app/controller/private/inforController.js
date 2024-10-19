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
            
            res.render('partials/component/private/inforUser', {
                enableHeader: false,
                configHeader: res.locals.configHeader,
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