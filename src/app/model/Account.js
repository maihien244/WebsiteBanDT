const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Account = new Schema({
    fullname: { type: String, require: true},
    email: {type: String, require: true},
    phoneNumber: {type: String, require: true},
    password: { type: String, require: true},
    role: { type: String, require: true, default: 'user'}, //user, editor, admin
    avatar: { type: String, default: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAYBAwUCB//EADgQAAICAQICBwUHAgcAAAAAAAABAgMEBREhMQYSMkFRYXETIkJSgRQjM5GhwdFi8ENUY3KCseH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALMACqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+q/MAD3Cq2fYqsl6RbEqbYduqcfWLQHgAAAAAAAAAAAAAAAAAAAAAAAAAADMU5SUYpuT4JLmzMISnOMYRblJ7JLxLlomj14EFbalLJa5v4fJAcvTujc7FGzNk60/wDDjz+rO/jaZh4v4NEN/ma3ZLMkRhLYbfUyAIWVpWHlR2tohv3SitmvqcDUejdtKdmHJ2x59SXa+niWww1uB82a2bTT3Xc1xMFx1zRYZsZXUJRyEu74/JlPknFtSTTXBp9xVYAAAAAAAAAAAAAAAAAAAbg9Qi7Jxrjzk+r+YFi6K6cpb51i3+Gvf9WWbbvNeLRHHx66YLZQikbSIAAAAAAAAxsVbpVpyhNZlceDe1m36MtRHzceOVi3UyXCcdl69wHzwGWnFuLWzXAwVQAAAAAAAAAAAAAAAAnaLBWapjRa4dfcgnQ0B9XV8dv5tv0Ava5ALkCIAAAAAAAAAAD5/q0PZ6plxS2Stf68SITtbl1tXy2vn/6WxBKoAAAAAAAAAAAAAAAAbsS10ZVVqfYkpfQ0gD6VCSlCMlya3MnF6M5qyMH2MvxKOD84939+R2iIAAAAAAAAHiyarhKcntGK3foezidKM77Ph+wjL37uH/HvAqeRa78iy6XOcnJ/VmsAqgAAAAAAAAAAAAAAAAAAkYGXZhZUb6u7hJN9peBesLLqzaI3US3i1xXen4M+ekrT8+/Av9pTJ7N+9B8pepEfQQczTdZxc3aPW9nd31y/Z9509wAMbobgZBjc5mpa3i4cXGE1bd3Qi99vVgSs/NpwaHdc+C5Lfi34FFzsuzMyZX3c2+EV8K8D1n51+dd7S+W+3ZiuUSMVQAAAAAAAAAAAAAAAAAAAAAAAAm4uq52KurXe+quUZe8iEAO3DpNmpe9XU36MS6TZrW0a6Y+ezZxABMytUzcpNXZEuq/hjwRE+hgAAAAAAAAAAAAAAAAAAAAAAAGdjZj41+TYq6KpWS8gNXfsO8sWD0Yk0p5tyj/p1/uzuYumYeKvuaIJ/M1uwKVTp+Zf+Fj2S89tibX0d1Ca4whD/dP+C5gCpx6L5b7V1K/N/sZfRfI/zFP5MtYAp8+jedHsSpn6Sa/YiX6Rn0LeeNNrxjxL2EtgPnEouDSmnF+D4Hl8D6Hfi0ZEdr6oTX9SOPmdGcexOWLY6ZfK+MQKoCZnaZlYLXtq/cfKceMSJtw3AwAAAAAAAAAAAAADvPdVU7rI11RcpyeyS7y26NodeGlbftZkfpD0A5ml9HbL0rM3eut8VX8T9fAs+Pj1Y1arpgoRXckbFtsZAAAAAAoAAAAAAADEoxlFxkk0+aZwdU6OwtUrcHaub+B9mX8HfGwR85upsotlVdBwnHmpHgvmpadRn1dW2PvLszXOJTNQwrsC91XRf9MlykgIwAAAAAAAB6rrnbZGuqLlOb2SR5Ld0d0r7JV9ouX39i4L5V/IEjRtKr0+rrTSlfJe9Lw8kdMIAAAFAAAAAAAAAAAAAAAACNnYdWbjypuitnye3GL8USQEfP8APwrcG902rl2ZfMiMXrVtPjqGM4dmyPGEn3P+Cj2VyqslXZFxnF7NPuA8gAAAbMemeRfCmpe9OXVQHW6Nad9qyHk2r7qp7JP4pf8Ahbl6bGnCxoYmNCmte7FbevmbwAACgAAAAAAAAAAAAAAAAAAAAAVzpRp26WbVHintb6eJYzxdXC6uVdi3jJbNeQR8558Qb83HliZduPLnB8/FeJoA/9k='},
    dateRegister: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Account', Account)