module.exports = function SortMiddleware(req, res, next) {
    const isValidType = ['asc', 'desc', 'default'].includes(req.query.type)
    if(!isValidType) {
        req.query.type = 'asc'
    }
    res.locals._sort = {
        enabled: false,
        type: 'default',
    }

    if(req.query.hasOwnProperty('_sort')) {
        Object.assign(res.locals._sort, {
            enabled: true,
            type: req.query.type,
            column: req.query.column,
        })
    }
    next()
}