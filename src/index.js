const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const handlebar = require('express-handlebars')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const cors = require('cors')
const morgan = require('morgan')

require('dotenv').config({ path: __dirname + '/.env'})

const route = require('./routes')
const database = require('./config/database')

const checkRoleAccount = require('./app/helper/checkRoleAccpunt')
const pagination = require('./app/helper/pagination')
const sortable = require('./app/helper/handlebars')

//lập lịch tạo một số trường trong database
const taskCron = require('./app/util/taskCron')

// const checkTokenExpMiddleware = require('./app/middleware/checkTokenExpMiddleware')
// const userLoginMiddleware = require('./app/middleware/userLoginMiddleware')

const socketConfig = require('./app/socket')

const port = 3000
const app = express()
//connect to database
database.connectDatabase()

//morgan
app.use(morgan('combined'))

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

app.use(express.json())
//user middleware

//cors option
const corsOption = {
    "origin": ['http://localhost:3000', 'http://localhost:8080'],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

app.use(cors(corsOption))

//static file
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/css', express.static(path.join(__dirname, '/public/assent/css')))
app.use('/js', express.static(path.join(__dirname, '/public/js')))

//lập lịch
taskCron()

route(app)

socketConfig(app)

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})