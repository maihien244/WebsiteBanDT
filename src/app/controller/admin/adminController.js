const jwt = require('jsonwebtoken')

const Account = require('../../model/Account')
const ConfigAdmin = require('../../model/ConfigAdmin')

const { toObjectLiteral } = require('../../util/convertToObjectLiteral')
const { info } = require('sass')

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

class AdminController {
    //[get] private/infor
    async getAdminPage(req, res, next) {
        try {

            const info_total_year = await ConfigAdmin.findOne({
                idYear: (new Date()).getFullYear().toString(),
            })
            if(!info_total_year) {
                await ConfigAdmin.create({
                    idYear: String(year),
                })
            }
            let earning_year = info_total_year?.total_amount_year || 0
            let earning_month = 0
            let pending_count = 0
            let completed_count = 0
            info_total_year?.total_month.forEach((monthly) => {
                if(monthly.idMonth == month[(new Date()).getMonth()]) {
                    earning_month = monthly?.total_amount_month || 0
                    pending_count = monthly?.pending_count || 0
                    completed_count = monthly?.completed_count || 0
                }
            })
            res.render('partials/component/admin/adminPage', {
                enableHeader: false,
                layoutPage: 'dashboard',
                configHeader: {
                    earning_year,
                    earning_month,
                    pending_count,
                    completed_count,
                },
            })

        } catch(err) {
            console.log(err)
            res.status(500).json({
                type: 'error',
                message: 'Server get information user fail!',
                err,
            })
        }
    }
}

module.exports = new AdminController