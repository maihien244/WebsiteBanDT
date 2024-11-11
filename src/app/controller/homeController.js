const Product = require('../model/Product')

const { toObjectLiteral, toMultiObjectLiteral } = require('../util/convertToObjectLiteral')

class HomeController {
    async getHomePage(req, res, next) {
        const PAGE_SIZE = 12
        let page_number = req.query?.page || 1
        page_number = (page_number < 1)? 1 : page_number
        let products = []
        products = toMultiObjectLiteral(await Product.find({})
                                                .skip((page_number - 1)*PAGE_SIZE)
                                                .limit(PAGE_SIZE)
            )
        let numberPages = (await Product.find({})).length / PAGE_SIZE
        numberPages = (numberPages == parseInt(numberPages)) ? parseInt(numberPages) : (parseInt(numberPages) + 1)

        res.render('home', {
            products,
            enableHeader: true,
            currentPage: page_number,
            numberPages,
        })
    }
}

module.exports = new HomeController