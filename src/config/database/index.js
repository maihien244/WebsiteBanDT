const mongoose = require('mongoose')
let connection;
const connectDatabase = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/DBWebsiteBanDienThoai', {
            autoIndex: true,
        })
        console.log('Connected succesfully')
        connection = mongoose.connection
    } catch(err) {
        const obError = {
            message: 'Connection failed',
            err,
        }
        console.log(obError)
        connectDatabase()
    }
}

module.exports = { connectDatabase, connection }