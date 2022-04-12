module.exports = function sortMiddleware(req, res, next) {

    res.locals._sort = {
        enabled: false,
        type: 'default',
    }

    if (req.query.hasOwnProperty('_sort')) {
        res.locals._sort.enabled = true
    }

    var isValidType = ['asc', 'desc'].includes(req.query.type)
    res.locals._sort.type = isValidType ? req.query.type : 'desc'
    res.locals._sort.column = req.query.column
    res.locals._sort.search = req.query.keyword

    next()
}