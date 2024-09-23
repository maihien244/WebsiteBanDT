const publicRoutes = require('./publicRoutes')
const privateRoutes = require('./privateRoutes')

function route(app) {
    app.use('/private', privateRoutes)
    app.use('/', publicRoutes)
}
module.exports = route