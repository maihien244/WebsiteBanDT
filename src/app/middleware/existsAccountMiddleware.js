const mongoose = require('mongoose')

const Account = require('../model/Account')

module.exports = async function (req, res, next) {
    try {
        const existsEmail = !!(await Account.findOne({
            email: req.body.email
        })) 
        const existsPhoneNumber = !!(await Account.findOne({
            phoneNumber: req.body.phoneNumber
        }))
        if(existsEmail || existsPhoneNumber) {
            const messReponse = {
                message: 'email or phone number exists',
                emailResponse: existsEmail,
                phoneNumberResponse: existsPhoneNumber,
            }
            res.json(messReponse)
        } else {
            next()
        }
    } catch(err) {
        const messReponse = {
            message: 'database error'
        }
        res.status(500).json(messReponse)
    }
}