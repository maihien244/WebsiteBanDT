const msPerDay = 1000*60*60*24 

module.exports = (res, token) => {
    res.cookie('at', token.accessToken, {
        maxAge: 1000 * 60 * 10, // would expire after 10 minutes
    })
    res.cookie('rt', token.refreshToken, {
        maxAge: 5 * msPerDay, // would expire after 5 days
    })
}