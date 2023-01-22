const FacebookStrategy = require('passport-facebook').Strategy

const mongoose = require('mongoose')
const User = require('../../app/models/User')

module.exports = function (passport) {



    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })


    passport.use(new FacebookStrategy({
        clientID: '2904483719862070',
        clientSecret: 'ec7c74f3d3dc8f1a96849067c3dce54a',
        callbackURL: `${process.env.LOGIN_CALLBACK_URL}/user/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'name', 'email', 'gender', 'picture.type(large)'],
    }, (accessToken, refreshToken, profile, done) => {
            User.findOne({ 'facebook.id': profile.id }, (err, user) => {
                if (err) throw err

                if (user)
                    return done(null, user)

                else {
                    var newUser = new User()
                    newUser.type = 'facebook'
                    newUser.facebook.token = accessToken
                    newUser.facebook.id = profile.id
                    newUser.facebook.username = profile.displayName
                    newUser.facebook.email = profile?.emails[0].value
                    newUser.facebook.avatar = profile?.photos[0].value
                    newUser.facebook.firstName = profile._json.first_name
                    newUser.facebook.lastName = profile._json.last_name

                    newUser.save(err => {
                        if (err) throw err
                        return done(null, newUser)
                    })
                }

            })

        }   
    ))


}