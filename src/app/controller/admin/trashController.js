const jwt = require('jsonwebtoken')
const path = require('path')

const Product = require('../../model/Product')

const { toObjectLiteral, toMultiObjectLiteral } = require('../../util/convertToObjectLiteral')
const convertUriToList = require('../../util/convertUriToList')

let sort = {}

function sortProduct(a, b) {
    if(sort?.type == 'asc') {
        if(a[sort?.column] < b[sort?.column]) {
            return 1;
        } else {
            return -1;
        }
    } else {
        if(a[sort?.column] < b[sort?.column]) {
            return -1;
        } else {
            return 1;
        }
    }
}

class TrashController {

    //[get] /admin/trash
    async getTrashPage(req, res, next) {
        const PAGE_SIZE = 10
        let page_number = req.query?.page || 1
        page_number = (page_number < 1)? 1 : page_number
        let products = []
        sort = res.locals._sort
        products = toMultiObjectLiteral(await Product.findDeleted({}))
        let tmp = []
        for(let i = (page_number - 1)*PAGE_SIZE; i < page_number*PAGE_SIZE; ++i) {
            if(!!products[i] && products[i]?.deleted) {
                tmp.push(products[i])
            }
        }
        products = tmp.sort(sortProduct)
        let numberPages = (await Product.find({})).length / PAGE_SIZE
        numberPages = (numberPages == parseInt(numberPages)) ? parseInt(numberPages) : (parseInt(numberPages) + 1)
        // console.log(numberPages)
        res.render('partials/component/admin/adminPage', {
            products, 
            _sort: res.locals._sort,
            enableHeader: false,
            currentPage: page_number,
            numberPages,
            layoutPage: 'trash',
        })
    }

    //[patch] /:id/restore
    async restoreProduct(req, res, next) {
        try {
            const id = req.params.id
            await Product.restore({_id: id})
            res.redirect('/admin/trash')
        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Error restore the product',
                error: err,
            })
        }
    }

    //[patch] /:list/restoreList
    async restoreList(req, res, next) {
        try {
            let list = convertUriToList(req.params.list)
            list.forEach(async (id) => {
                await Product.restore({_id: id})
            })
            res.redirect('/admin/trash')
        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Error restore the list product',
                error: err,
            })
        }
    }

    //[delete] /:id/force
    async forceProduct(req, res, next) {
        try {
            const id = req.params.id
            await Product.deleteOne({_id: id})
            res.redirect('/admin/trash')
        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Error delete the product',
                error: err,
            })
        }
    }

    //[patch] /:list/forceList
    async forceList(req, res, next) {
        try {
            let list = convertUriToList(req.params.list)
            list.forEach(async (id) => {
                await Product.deleteOne({_id: id})
            })
            res.redirect('/admin/trash')
        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Error delete the list product',
                error: err,
            })
        }
    }
}

module.exports = new TrashController