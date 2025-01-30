const mongoose = require('mongoose')
const cron = require('node-cron')
const { ObjectId } = require('mongodb')

const Schema = mongoose.Schema;

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const ConfigAdmin = new Schema({
    idYear: { type: String, require: true},
    total_amount_year: { type: Number, default: 0},
    total_month: {type: Array, default: [
        {
            idMonth: month[(new Date()).getMonth()], //_id: thang
            total_amount_month: 0,
            pending_count: 0,
            completed_count: 0,
            pending: [], // [{idUser, idCart}]
            
            completed: [],  
            // [
            //     {
            //         idUser: { type: String, require: true},
            //         idCart: { type: String, require: true},
            //     }
            // ]
        }
    ]}
})
         

module.exports = mongoose.model('ConfigAdmin', ConfigAdmin)