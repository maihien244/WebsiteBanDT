const mongoose_delete = require('mongoose-delete')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = Schema({
    name: { type: String, require: true},
    manufacturer: { type: String, require: true},
    status: { type: String, require: true},
    price: { type: Number, require: true},
    discount: { type: Number, require: true},
    star: { type: Number, require: true, default: 5},
    img: { type: String, require: true},
    dateRegister: { type: Date, default: Date.now },
})

Product.plugin(mongoose_delete, {
    overrideMethods: true,
    deleteAt: true,
})

module.exports = mongoose.model('Product', Product)