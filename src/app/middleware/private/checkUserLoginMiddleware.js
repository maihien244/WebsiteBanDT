const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    if(!!req.cookies.rt) {
        try {
            const decoded = await jwt.verify(req.cookies.rt, process.env.PRIMARY_KEY, {algorithms: 'HS256'})
            res.locals.id = decoded.id
            next()
        } catch(err) {
            console.log('check user login middle')
            console.log(err)
            // res.json({
            //         type: 'warn',
            //         message: 'failure access private page',
            //         uri: 'http://localhost:3000/login'
            //     })
            // res.redirect('/login')
        }
    } else {
        // res.json({
        //             type: 'warn',
        //             message: 'failure access private page',
        //             uri: 'http://localhost:3000/login'
        //         })
        res.redirect('/login')
    }
}