const jwt = require('jsonwebtoken')
const Account = require('../../model/Account')

module.exports = async (req, res, next) => {
    if(!!req.cookies.rt) {
        try {
            const decoded = await jwt.verify(req.cookies.rt, process.env.PRIMARY_KEY, {algorithms: 'HS256'})
            res.locals.id = decoded.id
            const account = await Account.findById({_id: decoded.id})
            if(account.role == 'admin') {
                next()
            } else {
                res.status(404).json({
                    type: 'error',
                    message: 'Page not found',
                })
            }
        } catch(err) {
            console.log(err)
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
}