const Apps = require("../models/Apps")
const Types = require("../models/Types")
const News = require("../models/News")
const User = require("../models/User")
const Equipments = require("../models/Equipment")
const slugify = require('slugify')
const { multiMongooseToObj, singleMongooseToObj, singleArrMongooseToObj } = require("../../ulti/mongoose")
const { deleteFolder, deleteFolders, deleteFiles, renameFolder } = require("../../ulti/fsdelete")
const multer = require('multer')
const upload = require('../middleware/UploadMiddleware')


class NewsDashboardController {

    //[GET] /dashboard/news/create
    createNews(req, res, next) {
        res.render('manager/post-news')
    }

    //[POST] /dashboard/news/create
    postNews(req, res, next) {
        console.log(res.locals.userSer.name)
        var obj = {
            id: req.postNewsId,
            user: {
                id: res.locals.userFullSer._id,
                name: res.locals.userSer.username,
                avatar: res.locals.userSer.avatar,
            },
            type: req.body.type,
            titleNews: req.body.titleNews,
            desc: req.body.desc,
            img: req.files.img ? `/upload/news/${req.postNewsId}/${req.files.img[0].filename}` : null,
            tag: req.body.tag.split(',').map(item => item.trim()),
            slug: slugify(req.body.titleNews, {
                replacement: '-',
                remove: undefined,
                strict: false,     
                lower: true,
                locale: 'vi',
                trim: true,
            }),
        }
        
        News.create(obj, err => {
            if(err) {
                console.log(err)
                return err
            }
            res.redirect('/dashboard/news/create')
        })
    }

    //[GET] /dashboard/news
    managerNews(req, res, next) {
        var regex
        if(req.query.keyword)
            regex = new RegExp(`${req.query.keyword}`, 'i')
        else
            regex = /\w+/g

        Promise.all([
            News.countDocuments({ deletedAt: { $gte: new Date(1970, 0, 1) }}),
            News.countDocuments({ deletedAt: null, $or: [{ titleNews: regex }, { tag: regex }] }),
            News.find({ deletedAt: null, $or: [{ titleNews: regex }, { tag: regex }] }).sort({ createdAt: -1 }).limit(9),
        ])
            .then(([countDeleted, countExist, news]) => {
                res.render('manager/manager-news', {
                    news: multiMongooseToObj(news),
                    countDeleted,
                    countExist,
                })
            })
            .catch((err) => console.log(err))
    }

    //[GET] /dashboard/news/edit/:id
    edit(req, res, next) {
        News.findOne({ _id: req.params.id })
            .then(news => {
                if(!news) return Promise.reject()
                
                res.render('manager/edit-news', { news: singleMongooseToObj(news) })
            })
            .catch(next);

    }

    //[POST] /dashboard/news/edit/:id
    editPost(req, res, next) {
        var imgObj = req.files.img
        var obj = {
            user: {
                id: res.locals.userFullSer._id,
                name: res.locals.userSer.username,
                avatar: res.locals.userSer.avatar,
            },
            titleNews: req.body.titleNews,
            name: req.body.name,
            type: req.body.type,
            desc: req.body.desc,
            tag: req.body.tag.split(',').map(item => item.trim()),
            slug: slugify(req.body.titleNews, {
                replacement: '-',
                remove: undefined,
                strict: false,     
                lower: true,
                locale: 'vi',
                trim: true,
            }),
        }
        
        //Save new field 'img'
        if (imgObj)
            obj.img = `/upload/news/${req.body.id}/${imgObj[0].filename}`
        else
            obj.img = req.body.oldImg

        //Handle delete image
        if (req.body.imgDelete) {
            deleteFiles({ name: req.body.id, imgDelete: req.body.imgDelete }, `src/public/upload/news`)
        }

        //Save to DB
        News.updateOne({ id: req.body.id }, obj)
            .then((data) => {
                if(!data) return Promise.reject()

                res.redirect(`/dashboard/news/edit/${req.params.id}`)
            })
            .catch(next)
    }

    //[POST] /dashboard/news
    deleteNews(req, res, next) {
        switch (req.body.action) {
                case 'delete': 
                    News.updateMany({ '_id': { $in: req.body.checkedList } }, { deletedAt: Date.now() })
                        .then(() => res.redirect('/dashboard/news'))
                        .catch((err) => console.log(err))
                    break
        }
    }

   //[GET] /dashboard/news/recycle
    recyclePage(req, res, next) {
        var regex
        if(req.query.keyword)
            regex = new RegExp(`${req.query.keyword}`, 'i')
        else
            regex = /\w+/g

        Promise.all([
            News.countDocuments({ deletedAt: { $gte: new Date(1970, 0, 1) }, $or: [{ titleNews: regex }, { tag: regex }],}),
            News.find({ deletedAt: { $gte: new Date(1970, 0, 1) }, $or: [{ titleNews: regex }, { tag: regex }],}).sort({ createdAt: -1 }).limit(9),
        ])
            .then(([countDeleted, news]) => {
                res.render('manager/recycle-news', {
                    news: multiMongooseToObj(news),
                    countDeleted
                })
            })
            .catch((err) => console.log(err))
    }

    //[POST] /dashboard/news/recycle
    recycleListItem(req, res, next) {
        switch(req.body.action) {
            case 'restore': 
                News.updateMany({_id: { $in: req.body.checkedList }}, { deletedAt: null })
                    .then(() => res.redirect('/dashboard/news/recycle'))
                    .catch(err =>  console.log(err))
                break
            case 'delete': 
                Promise.all([
                    News.find({ _id: { $in: req.body.checkedList }}),
                    News.deleteMany({ _id: { $in: req.body.checkedList }})
                ])
                    .then(([data]) => {
                        data = multiMongooseToObj(data)
                        data = data.map(element => ({name: element.id}))
                        deleteFolders(data, 'src/public/upload/news')
                        res.redirect('/dashboard/news/recycle')
                    })
                    .catch(err =>  console.log(err))
                break
        }
    }
}

module.exports = new NewsDashboardController() 