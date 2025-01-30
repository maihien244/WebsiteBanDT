const mongoose = require('mongoose')
const { toMultiObjectLiteral } = require('../util/convertToObjectLiteral')

const Product = require('../model/Product')

class SearchController {
    //[get] search
    async search(req, res, next) {
        console.log(req.body)
        const textSearch = req.body.textSearch
        console.log(textSearch)
        let products = toMultiObjectLiteral(await Product.find({
            $text: { $search: `\"${textSearch}\"` }
        }))
        products = products.map(item => {
            return {
                _id: item._id,
                name: item.name,
                img: item.img,
                price: item.price,}
            })
        // console.log(products)
            
        res.json({
            type: 'success',
            message: 'search success',
            data: products,
        })
    }
}

module.exports = new SearchController