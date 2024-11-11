module.exports = function(uri) {
    const object = {}
    const option = decodeURIComponent(uri).split('&')
    option.forEach((item) => {
        const tmp = item.split("=")
        object[tmp[0]] = tmp[1]
    })
    return {...object}
}