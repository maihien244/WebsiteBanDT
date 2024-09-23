const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Account = new Schema({
    username: { type: String, require: true},
    password: { type: String, require: true},
    numberPhone: {type: String, require: true},
    email: {type: String, require: true},
    dateRegister: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Account', Account)