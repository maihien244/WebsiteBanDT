

module.exports = async (req, res, next) => {
    if(!!req.cookies.at && !!req.cookies.rt) {
        next()
    } else {
        res.redirect('/login')
    }
}