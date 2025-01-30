const WishList = require('../../model/WishList')
const Product = require('../../model/Product')
const ConfigUser = require('../../model/ConfigUser')

const { toObjectLiteral, toMultiObjectLiteral } = require('../../util/convertToObjectLiteral')
const convertUriToList = require('../../util/convertUriToList')
const { default: mongoose } = require('mongoose')

let sort = {}

function sortWishList(a, b) {
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

class WishListController {
    //[get] /
    async showWishList(req, res, next) {
        const id = res.locals.id
        sort = res.locals._sort
        const PAGE_SIZE = 10
        let list = await WishList.findById(id)
        let tmp = []

        let numberPages = 0
    
        let page_number = req.query?.page || 1
        
        if(list) {
            list = toObjectLiteral(list).list

            numberPages = list?.length / PAGE_SIZE
            numberPages = (numberPages == parseInt(numberPages)) ? parseInt(numberPages) : (parseInt(numberPages) + 1)

            page_number = (page_number < 1)? 1 : page_number
            page_number = (page_number > numberPages)? 1 : page_number

            for(let i = (page_number - 1)*PAGE_SIZE; i < page_number*PAGE_SIZE; ++i) {
                const product = await Product.findById(list[i])
                if(!!product && !product?.deleted) {
                    tmp.push(product.toObject())
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
            wishlist: tmp,
            _sort: res.locals._sort,
            enableHeader: false,
            currentPage: page_number,
            numberPages,
            layoutPage: 'wishlist',
        })
    }

    //[post] /:id
    async addProductToWishList(req, res, next) {
        // console.log('wish list')
        const session = await mongoose.startSession()
        let messaage = {}
        try {
            await session.startTransaction()
            const id = res.locals.id
            const idProduct = req.params.id
            // console.log(id)
            // console.log(idProduct)
            const wishList = await WishList.findById(id)
            if(!wishList) {
                console.log('wish list 1')
                const option = {
                    _id: id,
                    list: [
                        idProduct,
                    ],
                }
                await WishList.create(option,{session})
                await ConfigUser.findOneAndUpdate({
                    _id: id
                }, {
                    $inc: { wishlist_count: 1},
                }, {
                    session,
                    upsert: true,
                })
                messaage = {
                    type: 'success',
                    message: 'Successfully add the product to wishlist'
                }
            } else {
                // console.log('wish list 2')
                // console.log(wishList.list)
                if(!JSON.stringify(wishList.list).includes(JSON.stringify(idProduct))){
                    await WishList.findByIdAndUpdate(id, {
                        "$inc": { "count": 1},
                        "$push": { "list" : idProduct}
                    }, {session})
                    const config = await ConfigUser.findOneAndUpdate({
                        _id: id
                    }, {
                        $inc: {wishlist_count: 1}
                    }, {
                        session,
                        upsert: true,
                    })
                    messaage = {
                        type: 'success',
                        message: 'Successfully add the product to wishlist'
                    }
                } else {
                    messaage = {
                        type: 'alert',
                        message: `The product was exist in wishlist`
                    }
                }
            }
            
            await session.commitTransaction()
        } catch(err) {
            console.log('wish list 3')
            console.log(err)
            messaage = {
                type: 'error',
                messaage: 'Has error into add product to wishlist',
                error: err,
            }
            await session.abortTransaction()
        } finally {
            await session.endSession()
            res.json(messaage)
        }
    }

    //[patch] /:id/delete
    async deleteProductInWishList(req, res, next) {
        const session = await mongoose.startSession()
        try {
            await session.startTransaction()
            const id = res.locals.id
            const idProduct = req.params.id
            await WishList.findByIdAndUpdate(id, {
                "$inc" : {count: -1},
                "$pull": { list: idProduct},
            }, {session})
            await ConfigUser.findByIdAndUpdate(id, {
                "$inc": {wishlist_count: -1}
            }, {session})
            await session.commitTransaction()
        } catch(err) {
            await session.abortTransaction()
            res.status(500).json({
                type: 'error',
                message: 'fail delete the product in wishlist',
                error: err,
            })
        } finally {
            await session.endSession()
            res.redirect('http://localhost:3000/private/wishlist')
        }

    }


    //[patch] /:list/deleteList
    async deleteProductsInWishList(req, res, next) {
        //convert uri to array
        const session = await mongoose.startSession()

        try {
            await session.startTransaction()

            const id = res.locals.id
            let listPd = req.params.list
            listPd = convertUriToList(listPd)
            console.log(listPd)
            await WishList.findByIdAndUpdate(id, {
                "$inc" : {count: -listPd.length},
                "$pull" : { list : { "$in": listPd}},
            }, { session})
            await ConfigUser.findByIdAndUpdate(id, {
                "$inc": {wishlist_count: -listPd.length}
            }, { session})
            await session.commitTransaction()
        } catch(err) {
            console.log(err)
            await session.abortTransaction()
            res.status(500).json({
                type: 'error',
                message: 'fail delete list product in wishlist',
                error: err,
            })
        } finally {
            await session.endSession()
            res.redirect('http://localhost:3000/private/wishlist')
        }
    }
}

module.exports = new WishListController