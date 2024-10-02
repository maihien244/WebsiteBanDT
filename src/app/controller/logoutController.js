const configHeader = require('../../config/handlebars/configHeader')

const Token = require('../model/Token')

class LogoutController {
    //[get] /logout
    async logoutAccount(req, res, next) {
        try {
            const refreshToken = req.cookies.rt
            const id = res.locals.configHeader.user.id
            res.clearCookie('at')
            res.clearCookie('rt')
            await Token.findOneAndDelete({
                id,
                refreshToken,
            })
            res.locals.configHeader = configHeader
            res.redirect('/')
        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Sever error!',
            })
        }
    }
}

module.exports = new LogoutController