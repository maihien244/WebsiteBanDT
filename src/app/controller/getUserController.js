const jwt = require('jsonwebtoken')

const Account = require('../model/Account')

class getUserController {
    //[get] /getUSer
    async getUserLogin(req, res, next) {
        try {
            const id = (await jwt.verify(req.cookies.at, process.env.PUBLIC_KEY, { algorithms: 'HS256'})).id
            const user = await Account.findById(id)
            res.json({
                id: user._id,
                fullname: user.fullname,
            })
        } catch(err) {
            res.json({})
        }
    }
}

module.exports = new getUserController