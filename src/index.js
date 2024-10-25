const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const handlebar = require('express-handlebars')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')

require('dotenv').config({ path: __dirname + '/.env'})

const route = require('./routes')
const database = require('./config/database')

const userLoginMiddleware = require('./app/middleware/userLoginMiddleware')
const checkTokenExpMiddleware = require('./app/middleware/checkTokenExpMiddleware')

const checkRoleAccount = require('./app/helper/checkRoleAccpunt')
const pagination = require('./app/helper/pagination')
const sortable = require('./app/helper/handlebars')
const port = 3000
const app = express()
//connect to database
database.connectDatabase()

//handlebar
app.engine('.hbs', handlebar.engine({
    extname: '.hbs',
    helpers: {
        ...checkRoleAccount,
        ...pagination,
        ...sortable,
    }
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'resources/views'))

//cookie parser
app.use(cookieParser())

//method override
app.use(methodOverride('_method'))

//config body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//static file
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/css', express.static(path.join(__dirname, '/public/assent/css')))
app.use('/js', express.static(path.join(__dirname, '/public/js')))

//middleware
app.use(checkTokenExpMiddleware)
app.use(userLoginMiddleware)

route(app)

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})