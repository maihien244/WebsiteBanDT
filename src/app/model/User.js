const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = Schema({
    _id: {type: String, require: true},
    fullname: { type: String, require: true},
    username: {type: String, default: ''},
    province: {type: String, default: ''},
    district: {type: String, default: ''},
    commune: {type: String, default: ''},
    specific_address: {type: String, default: ''},
}, {
    _id: false,
})

module.exports = mongoose.model('User', User)