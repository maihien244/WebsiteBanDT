module.exports = function(uri) {
    let list = uri.split('&')
    list = list.map((item) => item.split('='))
    return list
}