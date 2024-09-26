const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const handlebar = require('express-handlebars')
const cookieParser = require('cookie-parser')

require('dotenv').config({ path: __dirname + '/.env'})

const route = require('./routes')
const database = require('./config/database')


const port = 3000
const app = express()
//connect to database
database.connectDatabase()

//handlebar
app.engine('.hbs', handlebar.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//cookie parser
app.use(cookieParser())

//config body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//static file
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(path.join(__dirname, 'public/assent/css')))
app.use('/js', express.static(path.join(__dirname, 'public/js')))

route(app)

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})