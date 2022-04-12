module.exports = function returnBack(req, res, next) {
    req.session.returnTo = req.originalUrl || '/'
    req.session.returnTo =='/favicon.ico' ? req.session.returnTo = '/' : req.session.returnTo
    next()
}