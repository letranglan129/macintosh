const express = require("express")
const router = express.Router()
const passport = require('passport')
const errorMiddleware = require('../app/middleware/ErrorMiddleware')
const userController = require('../app/controllers/UserController')
const { authMiddleware } = require('../app/middleware/IsAuthenticatedMiddleware')
const upload = require('../app/middleware/UploadMiddleware')
function uploadOption(nameForler, options) {
    return upload(nameForler).fields(options)
}

router.get('/profile', authMiddleware.authUser(),userController.profilePage)
router.put('/profile', uploadOption('user', [{name: 'fileAvatar', maxCount: 1}]), userController.profileUpdate)
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.loginPage)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google'), userController.socialCb)
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }))
router.get('/auth/facebook/callback', passport.authenticate('facebook'), userController.socialCb)
router.get('*', errorMiddleware);

module.exports = router