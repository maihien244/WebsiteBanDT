const publicRoutes = require('./publicRoutes')
const privateRoutes = require('./privateRoutes')
const adminRoutes = require('./adminRoutes')

function route(app) {
    app.use('/admin', adminRoutes)
    app.use('/private', privateRoutes)
    app.use('/', publicRoutes)
}
module.exports = route
