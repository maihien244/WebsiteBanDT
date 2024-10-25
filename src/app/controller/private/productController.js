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

    // [delete] :id
    async deleteProduct(req, res, next) {
        const productId = req.param.id
        console.log(productId)
        Product.deleteById(productId, function(err, doc) {
            if(err) {
                res.status(500).json({
                    type: 'error',
                    message: 'Fail delete product to database',
                    error: err,
                })
            } else {
                res.redirect('/')
            }
        })
    }

}

module.exports = new ProductController