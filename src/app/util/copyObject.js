module.exports = function copyObject(obj) {
    let tmp = {}
    for( let key in obj) {
        if(typeof obj[key] != 'object') {         
            tmp[key] = obj[key]
        } else {
            tmp[key] = copyObject(obj[key])
        }
    }
    return tmp;
}
