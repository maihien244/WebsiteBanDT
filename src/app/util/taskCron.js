const configAdmin = require('../model/ConfigAdmin')
const cron = require('node-cron')

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

module.exports = async () => {
    // const option = {
    //     idMonth: month[(new Date()).getMonth()], //_id: thang
    //     total_amount_month: 0,
    //     pending_count: 0,
    //     completed_count: 0,
    //     pending: [],
    //     // [
    //     //     {
    //     //         idUser: { type: String, require: true},
    //     //         idCart: { type: String, require: true},
    //     //     }
    //     // ], 
    //     completed: [],  
    //     // [
    //     //     {
    //     //         idUser: { type: String, require: true},
    //     //         idCart: { type: String, require: true},
    //     //     }
    //     // ]
    // }
    // const config = await configAdmin.findOneAndUpdate({ idYear: (new Date()).getFullYear().toString()}, {
    //     "$push": {total_month: option},
    // })
    const task = cron.schedule('* * 1 * *', async () => {
        const option = {
            idMonth: month[(new Date()).getMonth()], //_id: thang
            total_amount_month: 0,
            pending_count: 0,
            completed_count: 0,
            pending: [],
            // [
            //     {
            //         idUser: { type: String, require: true},
            //         idCart: { type: String, require: true},
            //     }
            // ], 
            completed: [],  
            // [
            //     {
            //         idUser: { type: String, require: true},
            //         idCart: { type: String, require: true},
            //     }
            // ]
        }
        const config = await configAdmin.findOneAndUpdate({ idYear: (new Date()).getFullYear().toString()}, {
            "$push": {total_month: option},
        })
        if(!config) {
            await configAdmin.create({
                idYear: (new Date()).getFullYear().toString(),
                total_amount_year: 0,
                total_month: [
                    {
                        idMonth: month[(new Date()).getMonth()], //_id: thang
                        total_amount_month: 0,
                        pending_count: 0,
                        completed_count: 0,
                        pending: [],
                        // [
                        //     {
                        //         idUser: { type: String, require: true},
                        //         idCart: { type: String, require: true},
                        //     }
                        // ], 
                        completed: [],  
                        // [
                        //     {
                        //         idUser: { type: String, require: true},
                        //         idCart: { type: String, require: true},
                        //     }
                        // ]
                    }
                ]
            })
        }
    })
    
    task.start()   
}