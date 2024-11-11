const jwt = require('jsonwebtoken')
const path = require('path')

const Account = require('../../model/Account')

const { toObjectLiteral, toMultiObjectLiteral } = require('../../util/convertToObjectLiteral')
const convertUriToList = require('../../util/convertUriToList')
const convertUriToObject = require('../../util/convertUriToObject')

class AccessController {
    //[get] '/'
    async getAccountPage(req, res, next) {
        const PAGE_SIZE = 10
        let page_number = req.query?.page || 1
        page_number = (page_number < 1)? 1 : page_number
        let accounts = []
        if(req.query.hasOwnProperty('_sort')) {
            accounts = toMultiObjectLiteral(await Account.find({})
                                                .skip((page_number - 1)*PAGE_SIZE)
                                                .limit(PAGE_SIZE)
                                                .sort({
                                                    [res.locals._sort.column]: res.locals._sort.type
                                                }))
        } else {
            accounts = toMultiObjectLiteral(await Account.find({})
                                                .skip((page_number - 1)*PAGE_SIZE)
                                                .limit(PAGE_SIZE)
            )
        }
        accounts.forEach((acc) =>{
            acc.dateRegister = acc.dateRegister.toLocaleDateString("hi-IN")
        })
        let numberPages = (await Account.find({})).length / PAGE_SIZE
        numberPages = (numberPages == parseInt(numberPages)) ? parseInt(numberPages) : (parseInt(numberPages) + 1)
        // console.log(numberPages)
        res.render('partials/component/admin/adminPage', {
            accounts, 
            _sort: res.locals._sort,
            enableHeader: false,
            currentPage: page_number,
            numberPages,
            layoutPage: 'access-setting',
        })
    }

    //[get] /:id
    async getAccount(req, res, next) {
        try {
            const id = req.params.id
            const account =  await Account.findById(id)
            res.json({
                type: 'success',
                account,
            })
        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Failure find the account',
                error: err,
            })
        }
    }

    //[patch] /:id/edit/:option
    async editAccount(req, res, next) {
        let { id, option } = req.params
        option = convertUriToObject(option)
        try {
            await Account.findByIdAndUpdate(id, option)
            res.redirect('http://localhost:3000/admin/access-setting')
        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Failure update the account',
                error: err,
            })
        }
    }
    
    //[delete] /:id/delete
    async deleteAccount(req, res, next) {
        const id = req.params.id
        try {
            await Account.findByIdAndDelete(id)
            res.redirect('http://localhost:3000/admin/access-setting')
        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Failure delete the account',
                error: err,
            })
        }
    }

    //[delete] /:list/deleteList
    async deleteListAccount(req, res, next) {
        //convert uri to array
        try {
            let list = req.params.list
            list = convertUriToList(list)
            list.forEach(async (item) => {
                await Account.findByIdAndDelete(id)
            })
            res.redirect('http://localhost:3000/admin/access-setting')
        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Fail deleted products to datatbase',
                    error: err,
                })    
        }
    }
}

module.exports = new AccessController