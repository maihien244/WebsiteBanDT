const publicRoutes = require('./publicRoutes')
const privateRoutes = require('./privateRoutes')
const adminRoutes = require('./adminRoutes')

const checkTokenExpMiddleware = require('../app/middleware/checkTokenExpMiddleware')
const userLoginMiddleware = require('../app/middleware/userLoginMiddleware')

function route(app) {
    app.use(checkTokenExpMiddleware)
    app.use(userLoginMiddleware)
    app.use('/admin', adminRoutes)
    app.use('/private', privateRoutes)
    app.use('/', publicRoutes)
}
module.exports = route
