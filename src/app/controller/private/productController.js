const jwt = require('jsonwebtoken')
const path = require('path')

const Product = require('../../model/Product')

const { toObjectLiteral, toMultiObjectLiteral } = require('../../util/convertToObjectLiteral')

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
        res.render('partials/component/private/inforUser', {
            products, 
            _sort: res.locals._sort,
            enableHeader: false,
            currentPage: page_number,
            numberPages,
            layoutPage: 'products',
        })
    }

    async getInforProduct(req, res, next) {
        const productId = req.params.id
        try {
            const product = toObjectLiteral(await Product.findById(productId))
            console.log(product)
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
        res.redirect('http://localhost:3000/private/products')
    }

    async deleteListProducts(req, res, next) {
        //convert uri to array
        let list = req.params.list
        list = list.slice(1, list.length-1)
        list = list.split(',')
        list = list.map((item) => {
            return item.slice(1, item.length-1)
        })

        list.forEach(async (item) => {
            await Product.deleteById(item, function(err, doc) {
                if(err) {
                    res.status(500).json({
                        type: 'error',
                        message: 'Fail deleted products to datatbase'
                    })
                }
            })
        })
        res.redirect('http://localhost:3000/private/products')
    }
}

module.exports = new ProductController