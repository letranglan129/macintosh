const Apps = require('../models/Apps')
const User = require('../models/User')
const News = require('../models/News')
const bcrypt = require('bcrypt')
const passport = require('passport')
const {multiMongooseToObj, singleMongooseToObj} = require('../../ulti/mongoose')
const {deleteFolder, deleteFolders, deleteFiles, renameFolder} = require('../../ulti/fsdelete')
const {ROLE, authMiddleware} = require('../middleware/IsAuthenticatedMiddleware')

class UserController {


    //[GET] /user/profile
    profilePage(req, res, next) {
        res.render('profile')
    }
    
    //[PUT] /user/profile
    async profileUpdate(req, res, next) {
        
        var { username, firstName, lastName, address } = req.body
        var avatar

        if(Object.keys(req.files).length !== 0)
            avatar = `/upload/user/${req.user._id}/${req.files.fileAvatar[0].filename}`
        else if(req.body.avatar == '' && Object.keys(req.files).length == 0) 
            avatar = res.locals.userSer.avatar
        else
            avatar = req.body.avatar       

        if(req.body.avatar != '' || Object.keys(req.files).length !== 0) {
            var imgDelete = [];
            imgDelete.push(res.locals.userSer.avatar.split('/').pop())    
            deleteFiles({ name: req.user._id.toString(), imgDelete }, 'src/public/upload/user')
        }


        Promise.all([
            News.updateMany({"user.id": req.user._id}, { $set: { "user.avatar": avatar } }, (err, data) => {}),
            User.updateOne({ _id: req.user._id}, {  
                "$set": {
                   [`${req.user.type}.username`]: username,
                   [`${req.user.type}.firstName`]: firstName,
                   [`${req.user.type}.lastName`]: lastName,
                   [`${req.user.type}.address`]: address,
                   [`${req.user.type}.avatar`]: avatar,
                }
            }),
        ])
            .then(() => {
                res.redirect('/user/profile')
            })
            .catch((err) => console.log(err))
    }

    //[GET] /user/register
    registerPage(req, res, next) {
        res.render('register')
    }

    //[POST] /user/register
    register(req, res, next) {
        var {username, email, password, password2, agreeRule} = req.body
        var passwordMinLength = 6
        var emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        var errors = []
        
        if(!username || !email || !password || !password2 || !agreeRule) {
            errors.push({msg: 'Vui lòng hoàn thành tất cả các trường'})
        }

        if(password.length < passwordMinLength) {
            errors.push({msg: `Mật khẩu tối thiểu ${passwordMinLength} kí tự`})
        }

        if(password !== password2) {
            errors.push({msg: 'Mật khẩu nhập lại không chính xác'})
        }

        if(!emailReg.test(email)) {
            errors.push({msg: 'Email đúng định dạng. Vui lòng kiểm tra lại email'})
        }

        if(!agreeRule) {
            errors.push({msg: 'Vui lòng đọc và chấp nhận điều khoản'})
        }

        if(errors.length > 0) {
            res.render('register', {
                errors,
                username,
                email,
                password,
                password2,
            })
        } else {
            Promise.all([
                User.findOne({username: username}),
                User.findOne({email: email}),
            ])
            .then(([user1, user2]) => {

                if(user1 || user2) {
                    if(user1) {
                        errors.push({msg: 'Tên đã nhập đã tồn tại'})
                    }
                    if(user2) {
                        errors.push({msg: 'Email đã được sử dụng'})
                    }

                    res.render('register', {
                        errors,
                        username,
                        email,
                        password,
                        password2,
                    })

                } else {
                    var newUser = { 
                        type: 'local',
                        local: { 
                            username,
                            email, 
                            password,
                         }
                     }

                    bcrypt.hash(newUser.local.password, 10, (err, hash) => {
                        if(err) throw err

                        //Hash password
                        newUser.local.password = hash

                        //Save to DB
                        User.create(newUser)
                            .then(user => {
                                req.flash('success_msg', 'Đăng ký thành công!!! Bây giờ bạn có thể đăng nhập')
                                res.redirect('/user/login')
                            })
                            .catch((err) => {
                                req.flash('err_msg', 'Đăng ký không thành công!!! Vui lòng thử lại')
                                res.redirect('/user/register')
                            })
                    })
                }

            })
        }
    }


    //[GET] /user/login
    loginPage(req, res, next) {
        res.render('login')
    }

    //[POST] /user/login
    login(req, res, next) {
        var address = req.session.returnTo || '/'
        passport.authenticate('local', {
            successRedirect: address,
            failureRedirect: '/user/login',
            failureFlash: true,
        })(req, res, next);
    }

    //[GET] /user/logout
    logout(req, res, next) {
        req.logout()
        res.redirect('/user/login')
    }

    //[GET] /user/auth/google/callback
    //[GET] /user/auth/facebook/callback
    socialCb(req, res, next) {
        var address = req.session.returnTo || '/'
        res.redirect(address)
    }
}
module.exports = new UserController;