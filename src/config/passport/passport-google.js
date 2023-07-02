const mongoose = require('mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const User = require('../../app/models/User')


module.exports = function (passport) {

    passport.serializeUser((user, done) =>{
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
       User.findOne(id, (err, user) => {
           done(err, user)
       })
    })

    passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: `${process.env.LOGIN_CALLBACK_URL}/user/auth/google/callback`,
			},
			(accessToken, refreshToken, profile, done) => {
				User.findOne({ 'google.id': profile.id }, (err, user) => {
					if (err) throw err

					if (user) {
						return done(null, user)
					} else {
						var newUser = new User()
						newUser.type = 'google'
						newUser.google.id = profile._json.sub
						newUser.google.token = accessToken
						newUser.google.username = profile._json.name
						newUser.google.email = profile._json.email
						newUser.google.avatar = profile._json.picture || '/img/user1.jpg'
						newUser.google.firstName = profile.name.familyName
						newUser.google.lastName = profile.name.givenName

						newUser.save(err => {
							if (err) throw err
							return done(null, newUser)
						})
					}
				})
			},
		),
	)

}