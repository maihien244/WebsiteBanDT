const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const WishList = new Schema({
    _id: {type: String, require: true},
    count: {type: Number, default: 1},
    list: {type: Array, default: []},
}, {
    _id: false,
})

module.exports = mongoose.model('WishList', WishList)