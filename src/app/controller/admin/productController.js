const jwt = require('jsonwebtoken')
const path = require('path')
const { json } = require('body-parser')

const Product = require('../../model/Product')

const { toObjectLiteral, toMultiObjectLiteral } = require('../../util/convertToObjectLiteral')
const convertUriToList = require('../../util/convertUriToList')
const convertUriToObject = require('../../util/convertUriToObject')

class ProductController {
    //[get] private/products
    async getProducts(req, res, next) {
        const PAGE_SIZE = 10
        let page_number = req.query?.page || 1
        page_number = (page_number < 1)? 1 : page_number
        let products = []
        if(req.query.hasOwnProperty('_sort')) {
            products = toMultiObjectLiteral(await Product.find({})
                                                .skip((page_number - 1)*PAGE_SIZE)
                                                .limit(PAGE_SIZE)
                                                .sort({
                                                    [res.locals._sort.column]: res.locals._sort.type
                                                }))
        } else {
            products = toMultiObjectLiteral(await Product.find({})
                                                .skip((page_number - 1)*PAGE_SIZE)
                                                .limit(PAGE_SIZE)
            )
        }
        let numberPages = (await Product.find({})).length / PAGE_SIZE
        numberPages = (numberPages == parseInt(numberPages)) ? parseInt(numberPages) : (parseInt(numberPages) + 1)
        // console.log(numberPages)
        res.render('partials/component/admin/adminPage', {
            products, 
            _sort: res.locals._sort,
            enableHeader: false,
            currentPage: page_number,
            numberPages,
            layoutPage: 'products',
        })
    }

    //[get] /:id
    async getInforProduct(req, res, next) {
        const productId = req.params.id
        try {
            const product = toObjectLiteral(await Product.findById(productId))
            res.status(200).json({
                type: 'success',
                product,
            })
        } catch(err) {
            res.json({
                type : 'err',
                message: 'fail to connect database[getInforProduct]'
            })
        }
    }

    //[patch] /:id/edit
    async editProduct(req, res, next) {
        let {id, option} = req.params
        const object = {}
        option = decodeURIComponent(option).split('&')
        option.forEach((item) => {
            const tmp = item.split("=")
            object[tmp[0]] = tmp[1]
        })
        try {
            await Product.findByIdAndUpdate(id, object)
            res.redirect('/admin/products')
        } catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Error update the product',
                Error: err,
            })
        }
    }

    // [delete] :id
    async deleteProduct(req, res, next) {
        const productId = req.params.id
        console.log(productId)
        await Product.deleteById(productId, function(err, doc) {
            if(err) {
                res.status(500).json({
                    type: 'error',
                    message: 'Fail deleted products to datatbase'
                })
            }
        })
        res.redirect('http://localhost:3000/admin/products')
    }
    // [delete] :list
    async deleteListProducts(req, res, next) {
        //convert uri to array
        let list = req.params.list
        list = convertUriToList(list)
        list.forEach(async (item) => {
            await Product.deleteById(item, function(err, doc) {
                if(err) {
                    res.status(500).json({
                        type: 'error',
                        message: 'Fail deleted products to datatbase',
                        error: err,
                    })
                }
            })
        })
        res.redirect('http://localhost:3000/admin/products')
    }

    //[get] /create
    async getCreateProductPage(req, res, next) {
        res.render('partials/component/admin/adminPage', {
            enableHeader: false,
            layoutPage: 'createProduct',
        })
    }

    //[post] /create
    async createProduct(req, res, next) {
        try {
            const option = req.query
            await Product.create(option)
            res.redirect('http://localhost:3000/admin/products/create')
        } catch(err) {
            res.status(500),json({
                type: 'error',
                message: 'Fail add the product to datatbase',
                error: err,
            })
        }
    }
}

module.exports = new ProductController