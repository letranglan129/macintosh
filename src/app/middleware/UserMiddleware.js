const flash = require('connect-flash')
const { deletePropertyUserFull, deletePropertyUserMini } = require('../../ulti/deleteProperty')

module.exports = function(req, res, next) {

        res.locals.success_msg = req.flash('success_msg'),
        res.locals.error_msg = req.flash('error_msg'),
        res.locals.error = req.flash('error'),
        res.locals.user = req.user?.type ? deletePropertyUserMini(req.user[req.user.type]) : false
        res.locals.userFull = deletePropertyUserFull(req.user) 
        res.locals.userSer = req.user?.type ? req.user[req.user.type] : false
        res.locals.userFullSer = req.user
    next()
}