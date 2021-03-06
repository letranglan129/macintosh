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
            errors.push({msg: 'Vui l??ng ho??n th??nh t???t c??? c??c tr?????ng'})
        }

        if(password.length < passwordMinLength) {
            errors.push({msg: `M???t kh???u t???i thi???u ${passwordMinLength} k?? t???`})
        }

        if(password !== password2) {
            errors.push({msg: 'M???t kh???u nh???p l???i kh??ng ch??nh x??c'})
        }

        if(!emailReg.test(email)) {
            errors.push({msg: 'Email ????ng ?????nh d???ng. Vui l??ng ki???m tra l???i email'})
        }

        if(!agreeRule) {
            errors.push({msg: 'Vui l??ng ?????c v?? ch???p nh???n ??i???u kho???n'})
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
                        errors.push({msg: 'T??n ???? nh???p ???? t???n t???i'})
                    }
                    if(user2) {
                        errors.push({msg: 'Email ???? ???????c s??? d???ng'})
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
                                req.flash('success_msg', '????ng k?? th??nh c??ng!!! B??y gi??? b???n c?? th??? ????ng nh???p')
                                res.redirect('/user/login')
                            })
                            .catch((err) => {
                                req.flash('err_msg', '????ng k?? kh??ng th??nh c??ng!!! Vui l??ng th??? l???i')
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