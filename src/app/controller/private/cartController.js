const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
// const MongoClient = require('mongodb').MongoClient

// const database = require('../../../config/database')

const Cart = require('../../model/Cart')
const Product = require('../../model/Product')
const ConfigUser = require('../../model/ConfigUser')
const ConfigAdmin = require('../../model/ConfigAdmin')

const { toObjectLiteral, toMultiObjectLiteral } = require('../../util/convertToObjectLiteral')
const convertUriToObject = require('../../util/convertUriToObject')

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

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

class CartController {

    //[get] /
    async getCartPage(req, res ,next) {
        const id = res.locals.id
        sort = res.locals._sort
        const PAGE_SIZE = 10
        let list = await Cart.findById(id)
        if (list) {
            list = toObjectLiteral(list)?.list.filter(item => !item.deleted)
        } else {
            list = []
        }
        let tmp = []

        let numberPages = 0
        
        let page_number = req.query?.page || 1

        if(list) {

            numberPages = list?.length / PAGE_SIZE
            numberPages = (numberPages == parseInt(numberPages)) ? parseInt(numberPages) : (parseInt(numberPages) + 1)

            page_number = (page_number < 1)? 1 : page_number
            page_number = (page_number > numberPages)? 1 : page_number

            for(let i = (page_number - 1)*PAGE_SIZE; i < page_number*PAGE_SIZE; ++i) {
                if(!list[i]?.deleted && list[i]?.id) {
                    const product = await Product.findById(list[i]?.id)
                    if(!!product && !product?.deleted) {
                        let {deleted, ...option} = list[i]
                        option = Object.assign(product.toObject(), option)
                        option.price = parseFloat(option.price*(1 - parseFloat(option.discount/100))*option.quanlity)
                        option.dateBuy = (new Date(option.dateBuy)).toLocaleString("fr-FR")
                        // option.confirm = (option.confirm) ? 'true' : 'false'
                        tmp.push({...option})
                    }
                }
                // console.log(product)
            }
            // tmp = toMultiObjectLiteral(tmp)
        }

        // console.log(tmp)
        if(req.query.hasOwnProperty('_sort')) {
            tmp.sort(sortWishList)
        }

        // console.log(numberPages)
        res.render('partials/component/private/inforUser', {
            cart: tmp,
            _sort: res.locals._sort,
            enableHeader: false,
            currentPage: page_number,
            numberPages,
            layoutPage: 'cart',
        })
    }

    //[patch] /
    async addProductToCart(req, res, next) {
        // console.log(req.body)
        try {
            const id = res.locals.id
            let messaage = {}
            // console.log(id)
            let cart 
            const idCart = (new ObjectId()).toString()
            // console.log(idCart)
            const product = await Product.findById(req.body.id)
    
            const session = await mongoose.startSession()

            try {
                await session.startTransaction()
                await Cart.findOneAndUpdate({
                    _id: id
                }, {
                    $push: {
                        list: {
                            idCart,
                            name: product.name,
                            price: parseFloat(product.price*(1 - parseFloat(product.discount/100))*parseInt(req.body.quanlity)).toFixed(2),
                            ...req.body,
                        }
                    },
                    $inc: { count: 1},
                }, {
                    session,
                    upsert: true,
                })

                const cfa = await ConfigAdmin.findOneAndUpdate({
                    idYear: (new Date()).getFullYear().toString(),
                    'total_month.idMonth': month[(new Date()).getMonth()],
                }, {
                    $push : { 'total_month.$.pending': {
                        idUser: id,
                        idCart,
                    }},
                    $inc: {
                        'total_month.$.pending_count': 1,
                    }
                }, { session }) 
                // console.log(cfa)

                const config = await ConfigUser.findOneAndUpdate({
                    _id: id
                }, {
                    $push: {
                        cart: {
                            idCart,
                            total_amount: parseFloat(product.price*(1 - parseFloat(product.discount/100))*parseInt(req.body.quanlity)).toFixed(2),
                        }
                    },
                    $inc: { cart_count: 1},
                }, {
                    session,
                    upsert: true,
                })

                messaage = {
                    type: 'success',
                    messaage: 'Successfully add the product to cart',
                    code: 200,
                }

                await session.commitTransaction()
            } catch(err) {
                console.log(err)
                await session.abortTransaction()
                console.log(err)
                messaage = {
                    type: 'error',
                    messaage: 'Has error into add product to cart',
                    error: err,
                    code: 500,
                }
            } finally {
                await session.endSession()
            }
            
            res.status(messaage.code).json(messaage)

        } catch(err) {
            // console.log('cart 3')
            console.log(err)
            res.status(500).json({
                type: 'error',
                messaage: 'Has error into add product to cart',
                error: err,
            })
        }
    }

    //[patch] /:idcart/delete
    async deleteProductInCart(req, res, next) {
        try {
            const id = res.locals.id
            const idCart = req.params.idCart

            let messaage = {}

            const session = await mongoose.startSession()

            // const product = await Product.findById(idPd)

            await session.startTransaction()

            try {
                await Cart.updateOne(
                    {
                        _id: id,
                        'list': {
                            $elemMatch: {
                                idCart,
                                confirm: false,
                            }
                        }
                    }, 
                    {
                    "$inc" : {count: -1,},
                    "$set": { "list.$.deleted": true},
                }, { session }) 

                // const sp = await Cart.findOne(
                //     {
                //         _id: id,
                //         "list.idCart": idCart,
                //     })
                // console.log(sp)
                //hướng phát triển config user
                    // trong config uer ở phần cart_price chuyển thành Array
                    // trong mỗi arr chứa object gồm 
                    // {
                    //     idCart,
                    //     total_amount
                    // }
                await ConfigUser.findByIdAndUpdate(id, {
                    "$inc": {
                        cart_count: -1,
                    },
                    "$pull": { cart : { idCart,} },
                },  { session })

                const cfa = await ConfigAdmin.updateOne({
                    idYear: (new Date()).getFullYear().toString(),
                    // // 'total_month': { 
                    // //     '$elemMatch': { 
                    // //         'idMonth': month[(new Date()).getMonth()],
                    // //     }
                    // // },
                    'total_month.idMonth': month[(new Date()).getMonth()],
                }, {
                    $pull : {
                        'total_month.$.pending': {
                            idUser: id,
                            idCart,
                        },
                    },
                    $inc: {
                        'total_month.$.pending_count': -1,
                    }
                },{ 
                    session,
                    new: true,
                    useFindAndModify: false,
                })

                // nó không hoạt động khi pull là do idCart là ObjectId -> phải chuyển về string

                console.log(cfa)
                await session.commitTransaction()
            } catch(err) {
                await session.abortTransaction()
                console.log(err)
                messaage = {
                    type: 'error',
                    message: 'fail delete the product in cart',
                    error: err,
                    code: 500,
                }
            } finally {
                await session.endSession()
            }
            if(messaage?.type) {
                res.status(messaage.code).json(messaage)
            } else {
                res.redirect('http://localhost:3000/private/cart')
            }
        } catch(err) {
            console.log(err)
            res.status(500).json({
                type: 'error',
                message: 'fail delete the product in cart',
                error: err,
            })
        }

    }


    //[patch] /:list/deleteList
    async deleteProductsInCart(req, res, next) {
        //convert uri to array
        const session = await mongoose.startSession()
        await session.startTransaction()

        try {
            const id = res.locals.id
            let listIdCart = req.params.list
            listIdCart = convertUriToObject(listIdCart)

            // console.log(listIdCart)
            for(let key in listIdCart) {
                const product = await Product.findById(listIdCart[key])
                const ca = await Cart.updateOne(
                    {
                        _id: id,
                        'list': {
                            $elemMatch: {
                                idCart: key,
                                confirm: false,
                            }
                        }
                    }, {
                    "$inc" : {count: -1},
                    "$set": { "list.$.deleted": true},
                })
                // console.log(ca)
                await ConfigUser.findOneAndUpdate({
                    _id: id,
                    "cart.idCart": key,
                }, {
                    "$inc": { cart_count: -1, },
                    "$pull": { cart : { idCart: key,} },
                })

                const cfa = await ConfigAdmin.updateOne({
                    idYear: (new Date()).getFullYear().toString(),
                    'total_month.idMonth': month[(new Date()).getMonth()]
                }, {
                    $pull : {
                        'total_month.$.pending': {
                            idUser: id,
                            idCart: key,
                        },
                    },
                    $inc: {
                        'total_month.$.pending_count': -1,
                    }
                },{ 
                    session,
                    new: true,
                    useFindAndModify: false,
                })

                // {
                //     arrayFilters: [
                //       {
                //         "tm.idMonth": month[(new Date()).getMonth()]
                //       }
                //     ],
                //     multi: true
                // }
                // có thể sử dụng arrayFilters để lọc ra phần tử cần update
            }
            
            await session.commitTransaction()
        } catch(err) {
            await session.abortTransaction()
            console.log(err)
            res.status(500).json({
                type: 'error',
                message: 'fail delete list product in cart',
                error: err,
            })
        } finally {
            await session.endSession()
        }
        res.redirect('http://localhost:3000/private/cart')
    }
}

module.exports = new CartController