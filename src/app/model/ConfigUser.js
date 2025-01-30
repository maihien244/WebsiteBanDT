const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const Schema = mongoose.Schema;

const ConfigUser = new Schema({
    _id: {type: String, require: true},
    wishlist_count: {type: Number, default: 0},
    cart_count: {type: Number, default: 0},
    cart: [{
        idCart: {type: String, require: true},
        total_amount: { type: Number, require: true},
    }]
}, {
    _id: false,
})

module.exports = mongoose.model('ConfigUser', ConfigUser)