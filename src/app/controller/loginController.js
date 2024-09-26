
const Account = require('../model/Account')
const conferToken = require('../util/token/conferToken')
const addTokenToDB = require('../util/token/addTokenToDB')
const setCookie = require('../util/token/setCookie')
const { merge } = require('../../routes/publicRoutes/loginRouter')

class LoginController {
    //[get] /login
    showLoginPage(req, res, next) {
        res.render('partials/component/public/login')
    }

    //[post] /login
    async loginAccount(req, res, next) {
        try {
            const text_input = req.body.text_input
            const password = req.body.password

            const account = await Account.findOne({
                [res.locals.typeInput]: text_input,
                password,
            })

            if(!account) {
                res.json({
                    message: `The ${res.locals.typeInput == 'email' ? 'email' : 'phone number'} or password is incorrect`
                })
            }

            const token = await conferToken(account._id, undefined, undefined)
            await addTokenToDB(account._id, undefined, token.refreshToken)
            setCookie(res, token)
            res.redirect('/')
        } catch(err) {
            res.json({
                message: 'Login failed',
                err,
            })
        }
    }
}

module.exports = new LoginController