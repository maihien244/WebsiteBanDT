const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Token = new Schema({
    id: { type: String, require: true },
    refreshToken: { type: String, require: true },
})

module.exports = mongoose.model('Token', Token)