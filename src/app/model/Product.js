const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = Schema({
    name: { type: String, require: true},
    status: { type: String, require: true},
    price: { type: int, require: true},
    discount: { type: int, require: true},
    star: { type: float, require: true},
    img: { type: String, require: true},
    dateRegister: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Product', Product)