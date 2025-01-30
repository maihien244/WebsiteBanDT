const mongoose = require('mongoose')
const ConfigAdmin = require('./app/model/ConfigAdmin')
const Cart = require('./app/model/Cart')
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
require('dotenv').config({ path: __dirname + '/.env'})

const Schema = mongoose.Schema

const schema = new Schema({
    id: {type: String, require: true},
    list: []
}, {
    _id: false
})

const Test = mongoose.model('Test', schema)
async function cn() {
    try {
        console.log(process.env.MONGO_URI)
        const db = await mongoose.connect(process.env.MONGO_URI, {})
        console.log("sUCCESS")
        const cfa = await Test.findOneAndUpdate({
            id: 'Hien',
            list: {
                $elemMatch: {
                    a: 2
                }
            }
        }, {
            $set: {
                b : 1
            }
        }, {
            upsert: true
        })
        console.log(cfa)
    } catch(err) {
        console.log(err)
        console.log("fail")
    }
}

cn()