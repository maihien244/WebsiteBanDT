const mongoose = require('mongoose')

const Account = require('../model/Account')

const conferToken = require('../util/token/conferToken')
const addTokenToDB = require('../util/token/addTokenToDB')
const findIdAccount = require('../util/account/findIdAccount')
const setCookie = require('../util/token/setCookie')
const { mutipleToObjectLitera, toObjectLitera} = require('../util/convertToObject')

class RegisterController {
    //[get]
    showRegisterPage(req, res, next) {
        res.render('partials/component/public/register')
    }

    //[post]
    async createAccount(req, res, next) {
        try {
            await Account.create({
                fullname: req.body.fullname,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                password: req.body.password,
            })
            const id = await findIdAccount(req.body.email, undefined)
            const token = await conferToken(id, undefined, undefined)
            await addTokenToDB(id, undefined, token.refreshToken)
            setCookie(res, token)
            res.redirect('/')
            next()
        } catch(err) {
            res.status(500).json(err)
        }
    }
}

module.exports = new RegisterController