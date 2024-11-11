module.exports = function(uri) {
    let list = uri
    list = list.slice(1, list.length-1)
    list = list.split(',')
    list = list.map((item) => {
        return item.slice(1, item.length-1)
    })
    return list
}