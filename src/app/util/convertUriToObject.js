module.exports = function(uri) {
    const object = {}
    const option = uri.split('&')
    option.forEach((item) => {
        const tmp = item.split("=")
        object[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1])
    })
    return {...object}
}