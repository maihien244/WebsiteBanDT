const jwt = require('jsonwebtoken')
const path = require('path')
const { json } = require('body-parser')

const ConfigAdmin = require('../../model/ConfigAdmin')
const Cart = require('../../model/Cart')

const { toObjectLiteral, toMultiObjectLiteral } = require('../../util/convertToObjectLiteral')
const convertUriToList = require('../../util/convertUriToList')
const convertUriToObject = require('../../util/convertUriToObject')
const Product = require('../../model/Product')
const { default: mongoose } = require('mongoose')
const Completed = require('../../model/Completed')
const ConfigUser = require('../../model/ConfigUser')

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

class PendingClass {
    //[get] admin/pending
    async getPendingOrder(req, res, next) {
        const id = res.locals.id
        sort = res.locals._sort

        const PAGE_SIZE = 10
        let page_number = req.query?.page || 1
        page_number = (page_number < 1)? 1 : page_number
        //lấy ra các đơn hàng đang trong thời gian xét duyệt
        let pending =  []
        if(req.query.hasOwnProperty('_sort')) {
            pending = toMultiObjectLiteral(await Cart.find({ count: { $gt: 0}})
                                                .skip((page_number - 1)*PAGE_SIZE)
                                                .limit(PAGE_SIZE)
                                                .sort({
                                                    [res.locals._sort.column]: res.locals._sort.type
                                                }))
        } else {
            pending = toMultiObjectLiteral(await Cart.find({ count: { $gt: 0}})
                                                .skip((page_number - 1)*PAGE_SIZE)
                                                .limit(PAGE_SIZE)
            )
        }
        console.log(pending)
        let numberPages = (await Cart.find({count: { $gt: 0}})).length / PAGE_SIZE
        numberPages = (numberPages == parseInt(numberPages)) ? parseInt(numberPages) : (parseInt(numberPages) + 1)
        // console.log(numberPages)
        res.render('partials/component/admin/adminPage', {
            pending, 
            _sort: res.locals._sort,
            enableHeader: false,
            currentPage: page_number,
            numberPages,
            layoutPage: 'pending',
        })
    }
    //[get] admin/pending/:idUser
    async getPendingOrderUser(req, res, next) {
        const idUser = req.params.idUser
        try {
            const cartUser = toObjectLiteral(await Cart.findById({_id: idUser}))
            const list = cartUser.list
            if(list.length == 0) {
                res.status(203).json({
                    type: 'warning',
                    message: 'Not found',
                    data: []
                })
            } else {
                res.status(200).json({
                    type: 'success',
                    message: 'Success',
                    data: list
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({
                type: 'error',
                message: 'server error'
            })
        }
    }

    async confirmOrder(req, res, next) {
        const idUser = req.params.idUser
        const idCart = req.params.idCart
        // console.log(idUser, idCart)
        try {
            const cf = await Cart.updateOne({
                _id: idUser,
                'list': {
                    $elemMatch: {
                        idCart,
                        confirm: false,
                    }
                }
            }, {
                $set:{
                    'list.$.confirm': true
                }
            })
            if(cf.modifiedCount == 0) {
                res.status(203).json({
                    type: 'warning',
                    message: 'Error. Please reload and try again'
                })
            } else {
                res.status(200).json({
                    type: 'success',
                    message: 'Success'
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({
                type: 'error',
                message: 'server error'
            })
        }
    }

    //[patch] /:idUser/:idCart/succes
    async successOrder(req, res, next) {
        const idUser = req.params.idUser
        const idCart = req.params.idCart
        const session = await mongoose.startSession()

        let message = {}
        try {
            await session.startTransaction()
            let cfa = await Cart.findOneAndUpdate({
                _id: idUser,
                'list': {
                    $elemMatch: {
                        idCart,
                        confirm: true,
                    }
                }
            }, {
                $pull: {
                    list: { idCart },
                },
                $inc: { count: -1},
            }, {session})
            console.log(cfa)
            if(cfa == null) {
                throw new Error("not confirm")
            }
            console.log(1)
            cfa = toObjectLiteral(cfa).list.filter(item => item.idCart == idCart)[0]
            const option = {
                idCart,
                idProduct: cfa.id,
                fullname: cfa.fullname,
                address: cfa.address,
                phoneNumber: cfa.phoneNumber,
                quanlity: cfa.quanlity,
                price: cfa.price,
            }
            await Completed.findOneAndUpdate({
                _id: idUser,
            }, {
                $push: { list: option},
                $inc: {count: 1}
            },  {
                session,
                upsert: true,
            })

            await ConfigUser.updateOne({
                _id: idUser,
            }, {
                $pull: { cart: { idCart }},
                $inc: { cart_count: -1},
            }, {session})

            const cf = await ConfigAdmin.findOneAndUpdate({
                idYear: (new Date()).getFullYear().toString(),
                total_month: {
                    $elemMatch: {
                        idMonth: month[(new Date()).getMonth()]
                    }
                }
            }, {
                $inc: {
                    total_amount_year: parseFloat(cfa.price),
                    'total_month.$.total_amount_month': parseFloat(cfa.price),
                    'total_month.$.completed_count': 1,
                    'total_month.$.pending_count': -1,
                },
                $push: {
                    'total_month.$.completed': {
                        idUser,
                        idCart,
                    }
                }
            }, {session})

            await session.commitTransaction()
            message = {
                type: 'success',
                message: 'Update success'
            }
        } catch(err) {
            console.log(err)
            await session.abortTransaction()
            
            message = {
                type: 'error',
                message: 'error successOrder'
            }

            if(err.message == 'not confirm') {
                message.message = 'You have not confirmed the order'
            }
        } finally{
            await session.endSession()
            res.json(message)
        }
    }
    //[delete] /:idUser/:idCart/delete
    async deleteOrder(req, res, next) {
        console.log('day roi')
        const idUser = req.params.idUser
        const idCart = req.params.idCart
        let message = {}
        const session = await mongoose.startSession()
        try {
            await session.startTransaction()
            await Cart.updateOne({
                _id: idUser,
                list: {
                    $elemMatch: {
                        idCart,
                    }
                }
            }, {
                $inc: { count: -1},
                $pull: {
                    list: {
                        idCart,
                    }
                }
            }, {session})

            await ConfigAdmin.updateOne({
                idYear: (new Date()).getFullYear().toString(),
                total_month: {
                    $elemMatch: {
                        idMonth: month[(new Date()).getMonth()]
                    }
                }
            }, {
                $inc: {
                    'total_month.$.pending_count': -1
                },
                $pull: {
                    'total_month.$.pending': {
                        idCart,
                    }
                }
            }, {session})

            await ConfigUser.updateOne({
                _id: idUser,
            }, {
                $inc: {
                    cart_count: -1,
                },
                $pull: {
                    cart: {
                        idCart
                    }
                }
            }, {session})
            message = {
                type: 'success',
                message: 'Delete order success'
            }
            await session.commitTransaction()
        } catch(err) {
            console.log(err)
            message = {
                type: 'error',
                message: 'Error in deleted order',
            }
            await session.abortTransaction()
        } finally {
            await session.endSession()
            res.json(message)
        }
    }

    //[patch] //:uri/confirmList
    async confirmListOrder(req, res, next) {
        const uri = req.params.uri
        // console.log(uri)
        const list = convertUriToList(uri)
        const session = await mongoose.startSession()

        for (let item of list) {
            try {
                await session.startTransaction()

                const cfa = await Cart.updateOne({
                    _id: item[0],
                    list: {
                        $elemMatch: { 
                            idCart: item[1],
                            deleted: false,
                            confirm: false,
                        }
                    }
                }, {
                    $set: { 'list.$.confirm': true},
                }, {session})
                await session.commitTransaction()
            } catch(err) {
                console.log('confirm list order', err)
                await session.abortTransaction()
            }
        }
        await session.endSession()
        res.redirect('http://localhost:3000/admin/pending')
    }

    //[patch] //:uri/successList
    async successListOrder(req, res, next) {
        const uri = req.params.uri
        console.log(uri)
        let list = convertUriToList(uri)
        const obj = {}
        list.forEach((item) => {
            if(obj[item[0]] == undefined) {
                obj[item[0]] = [item[1]]
            } else {
                obj[item[0]].push(item[1])
            }
        })

        const session = await mongoose.startSession()

        try {
            for(let idUser in obj) {
                list = toObjectLiteral(await Cart.findById(idUser)).list
                for (let idCart of obj[idUser]) {
                    const cart = list.filter(item => item.idCart == idCart)[0]
                    const option = {
                        idCart,
                        idProduct: cart.id,
                        fullname: cart.fullname,
                        address: cart.address,
                        phoneNumber: cart.phoneNumber,
                        quanlity: cart.quanlity,
                        price: cart.price,
                    }
                    try {
                        await session.startTransaction()

                        let cfa = await Cart.findOneAndUpdate({
                            _id: idUser,
                            list: {
                                $elemMatch: {
                                    idCart,
                                    confirm: true,
                                }
                            }
                        }, {
                            $inc: { count: -1},
                            $pull: {
                                list: {
                                    idCart,
                                }
                            }
                        }, {session})
                        if(cfa == null) {
                            throw new Error('not confirm')
                        }

                        await ConfigUser.updateOne({
                            _id: idUser
                        }, {
                            $inc: { cart_count: -1},
                            $pull: {
                                cart: {
                                    idCart,
                                }
                            }
                        }, {session})

                        await ConfigAdmin.updateOne({
                            idYear: (new Date()).getFullYear().toString(),
                            total_month: {
                                $elemMatch: {
                                    idMonth: month[(new Date()).getMonth()],
                                }
                            }
                        }, {
                            $inc: {
                                total_amount_year: parseFloat(cart.price),
                                'total_month.$.total_amount_month': parseFloat(cart.price),
                                'total_month.$.pending_count': -1,
                                'total_month.$.completed_count': 1,
                            },
                            $pull: {
                                'total_month.$.pending': {idCart},
                            },
                            $push: {
                                'total_month.$.completed': {
                                    idUser,
                                    idCart,
                                }
                            }
                        }, {session})

                        await Completed.findOneAndUpdate({
                            _id: idUser,
                        }, {
                            $push: { list: option},
                            $inc: {count: 1}
                        },  {
                            session,
                            upsert: true,
                        })

                        await session.commitTransaction()
                    } catch(err) {
                        console.log(err)
                        await session.abortTransaction()
                    }
                }
            }
        } catch(err) {
            console.log('error in successListOrder', err)
            res.status(500).json({
                type: 'error',
                messaage: 'Server Error'
            }) 
        }
        await session.endSession()
        res.redirect('http://localhost:3000/admin/pending')
    }

    //[delete] //:uri/confirmList
    async deleteListOrder(req, res, next) {
        const uri = req.params.uri
        console.log(uri)
        let list = convertUriToList(uri)
        const obj = {}
        list.forEach((item) => {
            if(obj[item[0]] == undefined) {
                obj[item[0]] = [item[1]]
            } else {
                obj[item[0]].push(item[1])
            }
        })

        const session = await mongoose.startSession()

        try {
            for(let idUser in obj) {
                for (let idCart of obj[idUser]) {
                    try {
                        await session.startTransaction()

                        let cfa = await Cart.findOneAndUpdate({
                            _id: idUser,
                            list: {
                                $elemMatch: {
                                    idCart,
                                }
                            }
                        }, {
                            $inc: { count: -1},
                            $pull: {
                                list: {
                                    idCart,
                                }
                            }
                        }, {session})

                        await ConfigUser.updateOne({
                            _id: idUser
                        }, {
                            $inc: { cart_count: -1},
                            $pull: {
                                cart: {
                                    idCart,
                                }
                            }
                        }, {session})

                        await ConfigAdmin.updateOne({
                            idYear: (new Date()).getFullYear().toString(),
                            total_month: {
                                $elemMatch: {
                                    idMonth: month[(new Date()).getMonth()],
                                }
                            }
                        }, {
                            $inc: {
                                'total_month.$.pending_count': -1,
                            },
                            $pull: {
                                'total_month.$.pending': {idCart},
                            },
                        }, {session})

                        await session.commitTransaction()
                    } catch(err) {
                        console.log(err)
                        await session.abortTransaction()
                    }
                }
            }
        } catch(err) {
            console.log('error in successListOrder', err)
            res.status(500).json({
                type: 'error',
                messaage: 'Server Error'
            }) 
        }
        await session.endSession()
        res.redirect('http://localhost:3000/admin/pending')
    }
}

module.exports = new PendingClass