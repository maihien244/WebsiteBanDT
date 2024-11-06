const jwt = require('jsonwebtoken')

const Account = require('../../model/Account')

const { toObjectLiteral } = require('../../util/convertToObjectLiteral')

class AdminController {
    //[get] private/infor
    async getAdminPage(req, res, next) {
        try {
            const account = toObjectLiteral(await Account.findOne({
                _id: res.locals.id
            }))
            
            res.render('partials/component/admin/adminPage', {
                enableHeader: false,
                layoutPage: 'dashboard',
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

module.exports = new AdminController