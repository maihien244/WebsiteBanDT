const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
const Schema = mongoose.Schema;

const Cart = new Schema({
    _id: {type: String, require: true},
    count: {type: Number, require: true, default: 1},
    list: [{
        idCart: {type: String, require: true},
        id: {type: String, require: true},
        name: {type: String, require: true},
        fullname: {type: String, require: true},
        address: {type: String, require: true},
        phoneNumber: {type: String, require: true},
        quanlity: {type: Number, require: true},
        deleted: {type: Boolean, default: false},
        confirm: {type: Boolean, default: false},
        amount: {type: Number, require: true},
        price: {type: String, require: true},
        dateBuy: {type: Date, default: Date.now},
    }]
}, {
    _id: false,
})

module.exports = mongoose.model('Cart', Cart)