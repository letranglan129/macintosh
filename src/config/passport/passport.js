const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy

const User = require('../../app/models/User')

module.exports = {

    checkUser(passport) {
        passport.use(
            new LocalStrategy({usernameField: 'email'}, (email, password, done) => {

                User.findOne({ 'local.email': email })
                    .then(user => {
                        if(!user) {
                            return done(null, false, { message: 'Tài khoản chưa được đăng kí' })
                        }

                        //Match password
                        bcrypt.compare(password, user.local.password, (err, isMatch) => {
                            if(err) throw err

                            if(isMatch) {
                                return done(null, user)
                            }
                            else 
                                return done(null, false, { message: 'Mật khẩu không chính xác' })
                        })

                    })
                    .catch(err =>  console.log(err))
            })
        )

        passport.serializeUser((user, done)=> {
            done(null, user.id)
        })

        passport.deserializeUser((id, done) => {
            User.findById({ _id: id }, (err, user) => {
                done(err, user)
            })
        })

    }

}