const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const Cart = require('../../model/Cart')
const Product = require('../../model/Product')
const ConfigUser = require('../../model/ConfigUser')
const ConfigAdmin = require('../../model/ConfigAdmin')

const { toObjectLiteral, toMultiObjectLiteral } = require('../../util/convertToObjectLiteral')
const convertUriToObject = require('../../util/convertUriToObject')

let sort = {}
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

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

class CanceledController {

    //[get] /
    async getCanceledPage(req, res ,next) {
        const id = res.locals.id
        sort = res.locals._sort
        const PAGE_SIZE = 10
        let list = await Cart.findById(id)
        if (list) {
            list = toObjectLiteral(list).list.filter(item => item.deleted)
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
                if(list[i]?.deleted && list[i]?.id) {
                    const product = await Product.findById(list[i]?.id)
                    if(!!product && !product?.deleted) {
                        let {deleted, ...option} = list[i]
                        option = Object.assign(option, product.toObject())
                        option.price = parseFloat(option.price*(1 - parseFloat(option.discount/100))*option.quanlity).toFixed(2)
                        option.dateBuy = (new Date(option.dateBuy)).toLocaleString("fr-FR")
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
            cart: tmp,
            _sort: res.locals._sort,
            enableHeader: false,
            currentPage: page_number,
            numberPages,
            layoutPage: 'canceled',
        })
    }

    //[patch] /:idcart/:idPd/restore
    async restoreProductInCart(req, res, next) {
        const session = await mongoose.startSession()
        await session.startTransaction()
        try {
            const id = res.locals.id
            const idCart = req.params.idCart
            const idPd = req.params.idPd
            const product = await Product.findById(idPd)
            const carts = await Cart.findOneAndUpdate(
                {
                    _id: id,
                    "list.idCart": idCart,
                }, 
                {
                "$inc" : { 
                    count: 1,
                },
                "$set": { "list.$.deleted": false},
            }, {session})
            //tìm sản phẩm trong cart để tính lại giá trị
            const tmp = carts.list.filter((item) => {
                return item.idCart == idCart
            })
            // console.log(tmp)
            // console.log(product)
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
                    cart_count: 1,
                },
                "$push": { cart : { 
                    idCart,
                    total_amount: parseFloat(product.price*(1 - parseFloat(product.discount/100))*parseInt(tmp[0].quanlity)).toFixed(2),
                } },
            }, {session})

            const cfa = await ConfigAdmin.updateOne({
                idYear: (new Date()).getFullYear().toString(),
                // // 'total_month': { 
                // //     '$elemMatch': { 
                // //         'idMonth': month[(new Date()).getMonth()],
                // //     }
                // // },
                'total_month.idMonth': month[(new Date()).getMonth()],
            }, {
                $push : {
                    'total_month.$.pending': {
                        idUser: id,
                        idCart,
                    },
                },
                $inc: {
                    'total_month.$.pending_count': 1,
                }
            },{ 
                session,
                new: true,
                useFindAndModify: false,
            })
            await session.commitTransaction()
            
        } catch(err) {
            console.log(err)
            await session.abortTransaction()
            res.status(500).json({
                type: 'error',
                message: 'fail delete the product in cart',
                error: err,
            })
        } finally {
            session.endSession()
        }
        res.redirect('http://localhost:3000/private/canceled')
    }


    //[patch] /:list/deleteList
    async restoreProductsInCart(req, res, next) {
        const session = await mongoose.startSession()
        await session.startTransaction()
        //convert uri to array
        try {
            const id = res.locals.id
            let listIdPd = req.params.list
            listIdPd = convertUriToObject(listIdPd)
            // console.log(listIdCart)
            for(let idCart in listIdPd) {
                const product = await Product.findById(listIdPd[idCart])
                // console.log("product")
                // console.log(product)
                const carts = await Cart.findOneAndUpdate(
                    {
                        _id: id,
                        "list.idCart": idCart,
                    }, {
                    "$inc" : {
                        count: 1,
                    },
                    "$set": { "list.$.deleted": false},
                }, {session})

                //tìm sản phẩm trong cart để tính lại giá trị
                const tmp = carts.list.filter((item) => {
                    return item.idCart == idCart
                })
                // console.log(tmp)
                const cfu = await ConfigUser.updateOne({
                    _id: id
                }, {
                    "$inc": { cart_count: 1, },
                    "$push": { cart : { 
                        idCart: idCart,
                        total_amount: parseFloat(product.price*(1 - parseFloat(product.discount/100))*parseInt(tmp[0].quanlity)).toFixed(2),
                    } },
                }, {session})
                // console.log(cfu)

                const cfa = await ConfigAdmin.updateOne({
                    idYear: (new Date()).getFullYear().toString(),
                    'total_month.idMonth': month[(new Date()).getMonth()],
                }, {
                    $push : {
                        'total_month.$.pending': {
                            idUser: id,
                            idCart,
                        },
                    },
                    $inc: {
                        'total_month.$.pending_count': 1,
                    }
                }, {session})
                // console.log(cfa)

            }
            await session.commitTransaction()
        } catch(err) {
            console.log(err)
            await session.abortTransaction()
            res.status(500).json({
                type: 'error',
                message: 'fail delete list product in cart',
                error: err,
            })
        } finally {
            await session.endSession()
        }
        res.redirect('http://localhost:3000/private/canceled')
    }
}

module.exports = new CanceledController