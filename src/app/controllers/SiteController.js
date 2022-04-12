const Apps = require('../models/Apps')
const Types = require('../models/Types')
const News = require('../models/News')
const User = require('../models/User')
const Comments = require('../models/Comments')
const { multiMongooseToObj, singleMongooseToObj } = require('../../ulti/mongoose')
const { deletePropertyUserFull } = require('../../ulti/deleteProperty')
const { typeGame } = require('../../ulti/variable')

class SiteController {

    // [GET] /
    homePage(req, res, next) {
        Promise.all([
            Apps.find({ deletedAt: null, categoryType: { $ne: 'game' } }).sort({ updatedAt: -1 }).limit(9),
            Apps.find({ deletedAt: null, categoryType: 'ofMacM1' }).sort({ download: -1 }).limit(4),
            Apps.find({ deletedAt: null, categoryType: 'filmmaking' }).sort({ download: -1 }).limit(2),
            News.find({ deletedAt: null, type: 'repair-install'}).sort({ createdAt: -1 }).limit(3),
            Apps.find({ deletedAt: null, categoryType: 'game' }).sort({ createdAt: -1 }).limit(4),
            Apps.find({ deletedAt: null, categoryType: 'game' }).sort({ download: -1 }).limit(3),
            News.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(5),
        ])
            .then(([app, popularOfMacM1, appFilmmaking, newsRepair, newGame, downloadGame, news]) => {
                var isLogged = false
                var objRender = {
                    app: multiMongooseToObj(app),
                    popularOfMacM1: multiMongooseToObj(popularOfMacM1),
                    appFilmmaking: multiMongooseToObj(appFilmmaking),
                    newsRepair: multiMongooseToObj(newsRepair),
                    newGame: multiMongooseToObj(newGame),
                    downloadGame: multiMongooseToObj(downloadGame),
                    news: multiMongooseToObj(news),
                    isLogged,
                }

                res.render('home', objRender)
            })
            .catch(next)

    }

    //[POST] /search
    search(req, res, next) {
        var keyword = new RegExp(req.query.keyword, 'i')
        Promise.all([
            Apps.find({ deletedAt: null, name: keyword }).paginationHandle(req, res, next),
            Apps.countDocuments({ deletedAt: null, name: keyword }),
        ])
            .then(([app, countActive]) => {
                res.render('search', {
                    app: multiMongooseToObj(app),
                    pages: Math.ceil(countActive / res.locals.pagination.showPercent),
                    countActive,
                    isHaveApp: countActive != 0,
                    keyword: req.query.keyword,
                    currentPage: res.locals.pagination.page,
                })
            })
    }

    //[GET] /{categoryType}
    filter(filter) {
        return (req, res, next) => {
            Promise.all([
                Apps.find({ deletedAt: null, ...filter }).paginationHandle(req, res, next).sort({ createdAt: -1 }).limit(res.locals.pagination.showPercent),
                Apps.countDocuments({ deletedAt: null, ...filter }),
                Types.find({}),
            ])
                .then(([app, countActive, types]) => {
                    var hbs = 'category'
                    var isGame = false
                    if (req.originalUrl == '/game') 
                        hbs = 'game-category'

                    res.render(hbs, {
                        pathname: req.originalUrl,
                        app: multiMongooseToObj(app),
                        countActive,
                        countExist: countActive,
                        types: types[0].categoryTypeList,
                        path: req.originalUrl,
                        currentPage: res.locals.pagination.page,
                        pages: Math.ceil(countActive / res.locals.pagination.showPercent),
                        objType: { type: 'Game' },
                    })
                })
                .catch(next)
        }
    }

    //[GET] /news
    news(req, res, next) {
        News.find({})
            .then(data => {
                res.render('news', {
                    news: multiMongooseToObj(data)
                })
            })
            .catch(err => console.log(err))
    }

    //[GET] /news/:slug
    newsItemPage(req, res, next) {
        var newsObj
        var infoNews
        var commentsArr
        News.findOne({ slug: req.params.slug })
            .then(news => {
                if(!news) return Promise.reject()

                newsObj = news
                return Promise.all([User.findOne({ _id: news.user.id }), Comments.find({ appId: news._id })])
            })
            .then(([user, comments]) => {
                var userIdComment = []
                commentsArr = comments

                infoNews = {
                    news: singleMongooseToObj(newsObj),
                    userPost: {
                        username: user[user.type].username,
                        avatar: user[user.type].avatar,
                    },
                    countComment: commentsArr.length,
                    userLogged: res.locals.userFull
                }

                comments.forEach(comment => userIdComment.push(comment.userId))

                return User.find({ _id: { $in: userIdComment } })
            })
            .then(userComments => {
                res.render('news-item', {
                    infoNews,
                    userComment: deletePropertyUserFull(userComments),
                    comments: multiMongooseToObj(commentsArr),
                })
            })
            .catch(next)
    }

    //[GET] /game/type/:slug
    typeGamePage(req, res, next) {
        var objType = typeGame.find((element) => element.slug === `/${req.params.slug}`)

        Promise.all([
            Apps.countDocuments({ deletedAt: null, typeGame: objType?.type, categoryType: 'game' }),
            Apps.find({ deletedAt: null, typeGame: objType?.type, categoryType: 'game'  }).sort({ createdAt: -1 }).limit(10),
        ])
            .then( ([countExist, game]) => {
                if(!game) return Promise.reject()
                res.render('game-category', {
                    app: multiMongooseToObj(game),
                    types: { title: objType.type },
                    countExist,
                })
            })
            .catch(next)
    }

    //[GET] /api/type-game
    apiTypeGame(req, res, next) {
        res.json(typeGame)
    }

}
module.exports = new SiteController;