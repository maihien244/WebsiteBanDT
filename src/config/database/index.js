const mongoose = require('mongoose')

const connectDatabase = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/DBWebsiteBanDienThoai')
        console.log('Connected succesfully')
    } catch(err) {
        const obError = {
            message: 'Connection failed',
            err,
        }
        console.log(obError)
        connectDatabase()
    }
}

module.exports = { connectDatabase }