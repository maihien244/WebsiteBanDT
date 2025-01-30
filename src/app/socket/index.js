const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')

const Message = require('../model/Message')
const Account = require('../model/Account')
const {toMultiObjectLiteral} = require('../util/convertToObjectLiteral')


function socketConfig(app) {
    const server = require('http').createServer(app)
    const io = require('socket.io')(server, {
            cors: {
              origin: ["http://localhost:8080", "http://localhost:3000"],
              methods: ["GET", "POST"],
              allowedHeaders: ["my-custom-header"],
              credentials: true
            }   
    })

    io.use(async function(socket, next) {
        try {
            let token = socket.handshake.headers.cookie.split(';').map((item => item.trim()))
            token = {
                at: token[0].slice(3),
                rt: token[1].slice(3)
            }
            // console.log(token)
            const decode = await jwt.verify(token.at, process.env.PUBLIC_KEY, { algorithm: 'HS256'})
            socket.idUser = decode.id
            // console.log(decode)
            next()
        } catch(err) {
            console.log('28', err)
            next(new Error('authentication error'))
        }
    })

    io.on('connection', async (socket) => {
        console.log('socket connection')
        const idUser = socket.idUser
        let idRoom 
        console.log('idUser',idUser)
        let tmp = await Message.findOne({
            idUser: idUser
        })
        // console.log(tmp)
        if(tmp == null) {
            idRoom = (new ObjectId()).toString()
            tmp = await Message.create({
                idUser,
                idRoom,
                content: [],
            })

            let idReceiver = await Account.find({role: 'telesale'})
            idReceiver = idReceiver[Math.floor(Math.random() * idReceiver.length)]._id.toString()
            // console.log('id1',idReceiver.toString())
            await Message.create({
                idUser: idReceiver,
                idRoom,
                content: [],
                isRead: false,
            })

        } else {
            idRoom = tmp.idRoom
        }
        socket.join(idRoom)
        console.log('connect_socket11')
        socket.on('connect_socket', async ()=> {
            console.log('connect_socket')
            const mess = toMultiObjectLiteral(await Message.find({idRoom}))
            let content = []
            mess.forEach(item=> {
                const list = [...item.content]
                if(item.idUser == idUser) {
                    list.forEach(item => {
                        item.auth = 'me'
                    })
                } else {
                    list.forEach(item => {
                        item.auth = 'notMe'
                    })
                }
                content.push(...list)
            })
            console.log('content', content)
            content.sort((a, b) => {
                const date1 = new Date(a.date)
                const date2 = new Date(b.date)
                return date1.getTime() - date2.getTime()
            })
            content = content.map(item => {
                return {
                    auth: item.auth,
                    message: item.message,
                    date: (new Date(item.date)).toLocaleString(),
                }
            })
            socket.emit('connect_socket', content)
        })

        socket.on('send message', async (option) => {
            console.log('send message', option)
            const resp = await Message.findOneAndUpdate({
                idUser: socket.idUser,
            }, {
                $push: {
                    content: {
                        message: option.message,
                        date: option.date,
                    }

                }
            })
            socket.broadcast.emit('receiver message', option)
        })

    })

    server.listen(8080)
}

module.exports = socketConfig