const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Message = new Schema({
    idUser: {type: String, require: true},
    idRoom: {type: String, require: true},
    content: [],
    isRead: {type: Boolean, default: false},
})

module.exports = mongoose.model('Message', Message)

