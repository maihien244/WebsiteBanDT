const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const Completed = require('../../model/Completed')
const Product = require('../../model/Product')
const ConfigUser = require('../../model/ConfigUser')

const { toObjectLiteral, toMultiObjectLiteral } = require('../../util/convertToObjectLiteral')
const { prependOnceListener } = require('../../model/ConfigAdmin')

let sort = {}

function sortCompleted(a, b) {
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

class CompletedController {

    //[get] /
    async getCompletedOrder(req, res ,next) {
        const id = res.locals.id
        sort = res.locals._sort
        const PAGE_SIZE = 10
        let tmp = []
        let list =  await Completed.findById(id)
        console.log(list)
        let numberPages = 0
        let page_number = req.query?.page || 1
        
        
        if(list) {
            list = toObjectLiteral(list).list
            console.log(list)
            numberPages = list?.length / PAGE_SIZE
            numberPages = (numberPages == parseInt(numberPages)) ? parseInt(numberPages) : (parseInt(numberPages) + 1)
            page_number = (page_number < 1)? 1 : page_number
            page_number = (page_number > numberPages)? 1 : page_number
            for(let i = (page_number - 1)*PAGE_SIZE; i < page_number*PAGE_SIZE; ++i) {
                if(list[i]?.idProduct) {
                    const product = await Product.findById(list[i]?.idProduct)
                    if(!!product) {
                        let {deleted, ...option} = list[i]
                        option.name = product.name
                        // option = Object.assign(option, product.toObject())
                        // option.price = parseFloat(option.price*(1 - parseFloat(option.discount/100))*option.quanlity)
                        option.dateCompleted = (new Date(option.dateCompleted)).toLocaleString("fr-FR")
                        // option.confirm = (option.confirm) ? 'true' : 'false'
                        tmp.push({...option})
                    }
                }
                // console.log(product)
            }
        }

        // console.log(tmp)
        if(req.query.hasOwnProperty('_sort')) {
            tmp.sort(sortWishList)
        }

        // console.log(numberPages)
        res.render('partials/component/private/inforUser', {
            order: tmp,
            _sort: res.locals._sort,
            enableHeader: false,
            currentPage: page_number,
            numberPages,
            layoutPage: 'completed',
        })
    }

}

module.exports = new CompletedController