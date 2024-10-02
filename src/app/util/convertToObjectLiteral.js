module.exports = {
    toObjectLiteral(obj) {
        return obj.toObject()
    },

    toMultiObjectLiteral(arr) {
        return arr.map(obj => obj.toObject())
    }
}