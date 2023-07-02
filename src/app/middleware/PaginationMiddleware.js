module.exports = function paginationMiddleware(req, res, next) {

    res.locals.pagination = {
        enabled: false,
    }
    res.locals.pagination.page = req.query.page || 1
    res.locals.pagination.enabled = true
    res.locals.pagination.showPercent = parseInt(req.query.percent) || 15
    next()
}