const Apps = require("../models/Apps")
const Comments = require("../models/Comments")
const User = require("../models/User")
const News = require("../models/News")
const Types = require("../models/Types")
const { multiMongooseToObj, singleMongooseToObj, singleArrMongooseToObj } = require("../../ulti/mongoose")
const { nanoid } = require('nanoid')
const { deletePropertyUserFull } = require('../../ulti/deleteProperty')
const errorMiddleware = require('../middleware/ErrorMiddleware')


class AppController {

    //[GET] /app/:slug
    detail(req, res, next) {
        var apps
        var comments

        Apps.findOne({ deletedAt: null, slug: req.params.slug })
            .then(app => {
                if(!app) return Promise.reject()
                apps = app
                return Comments.find({ appId: app._id })
            })
            .then((comment) => {
                var userId = []
                comments = comment
                comments.forEach(comment => userId.push(comment.userId))
                return User.find({ _id: { $in: userId } })
            })
            .then((user) => {
                var hbs
                if(apps.categoryType.includes('game'))
                    hbs = 'game-item'
                else
                    hbs  = 'item'
                    
                res.render(hbs, {
                    app: singleMongooseToObj(apps),
                    comment: multiMongooseToObj(comments),
                    userComment: deletePropertyUserFull(multiMongooseToObj(user)),
                })
            })
            .catch(next)
    }

    //GET /app/test
    test(req, res, next) {
        News.updateMany({"user.id": '613626c503d2162ee49ca19d'}, { "user.avatar": 'null' }, (err, data) => {
            if(err) {
                console.log(err)
                throw err
            }
            res.json(data)
        })
    }

}
module.exports = new AppController()