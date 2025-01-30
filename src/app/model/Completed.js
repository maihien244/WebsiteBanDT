const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Completed = new Schema({
    _id: {type: String, require: true},
    count: {type: Number, default: 1},
    list: [{
        idCart: {type: String, require: true},
        idProduct: {type: String, require: true},
        fullname: {type: String, require: true},
        address: {type: String, require: true},
        phoneNumber: {type: String, require: true},
        quanlity: {type: Number, require: true},
        price: {type: Number, require: true},
        dateCompleted: {type: Date, default: Date.now}, 
    }]
}, {
    _id: false,
})

module.exports = mongoose.model('Completed', Completed)