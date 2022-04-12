const Apps = require("../models/Apps")
const Types = require("../models/Types")
const News = require("../models/News")
const Equipments = require("../models/Equipment")
const slugify = require('slugify')
const { multiMongooseToObj, singleMongooseToObj, singleArrMongooseToObj } = require("../../ulti/mongoose")
const { deleteFolder, deleteFolders, deleteFiles, renameFolder } = require("../../ulti/fsdelete")
const multer = require('multer')
const upload = require('../middleware/UploadMiddleware')



class AppsDashboardController {

    //[GET] /dashboard/
    manager(req, res, next) {
        var regex = new RegExp(`${req.query.keyword}`, 'i')
        Promise.all([
                Apps.find({ deletedAt: null }).sortable(req, res).paginationHandle(req, res),
                Apps.countDocuments({ deletedAt: { $gte: '1990-01-01' } }),
                Apps.countDocuments({ deletedAt: null }),
                Apps.find({ deletedAt: null, name: regex }).sortable(req, res).paginationHandle(req, res),
                Apps.countDocuments({ deletedAt: null, name: regex }),
                Types.find({}),
            ])
            .then(([app, countDeleted, countActive, appSearch, countSearch, types]) => {
                var objApp
                if (req.query.keyword) {
                    objApp = multiMongooseToObj(appSearch)
                    countActive = countSearch
                } else {
                    objApp = multiMongooseToObj(app)
                }
                
                res.render("manager/manager-app", {
                    countDeleted,
                    countActive,
                    isHadElement: countActive > 0 ? true : false,
                    app: objApp,
                    currentPage: res.locals.pagination.page,
                    pages: Math.ceil(countActive / res.locals.pagination.showPercent),
                    types: types[0].categoryTypeList
                })
            })
            .catch(err =>  console.log(err))
    }

    //[GET] /dashboard/app/create
    createPage(req, res, next) {
        Promise.all([Types.find({}), Equipments.find({})])
            .then(([type, equipmentList])=> {
                res.render("manager/create", { 
                    type: type[0].categoryTypeList, 
                    typeGames: type[0].typeGames, 
                    equipmentList: equipmentList[0].equipmentList,
                })
            })
            .catch((err) => console.log(err))
    }

    //[POST] /dashboard/app/create
    async create(req, res, next) {
        
        var obj = {
            typeGame: req.body.typeGame ? req.body.typeGame : null,
            name: req.body.name,
            type: req.body.type,
            desc: req.body.desc,
            class: req.body.class,
            img: req.files.img ? `/upload/app/${req.body.name}/${req.files.img[0].filename}` : null,
            link: req.body.link,
            equipment: req.body.equipment,
            price: Number(req.body.price),
            slug: slugify(req.body.name, {
                replacement: '-',
                remove: undefined,
                strict: false,     
                lower: true,
                locale: 'vi',
                trim: true,
            }),
            size: Math.floor(req.body.size),
            categoryType: req.body.categoryType,
        }
        
        var arr = []
        req.files.descImage.forEach((el) => {
            arr.push(el.filename)
        })
        obj.descImage = arr
        obj.descImage = obj.descImage.map(item => `/upload/app/${obj.name}/${item}`)
        
        Apps.create(obj, function (err, obj) {
            if (err) {
                console.log(err)
                res.json(err)        
            }
            res.redirect("/dashboard/app/create")
          })
                
        // uploadOption(req, res, function(err) {
        //     if (err instanceof multer.MulterError)
        //         res.send('Lỗi load ảnh')
        //     else if (err)
        //         res.send('Lỗi load ảnh')
        // })
    }

    //[GET] /dashboard/app/edit/:id
    editPage(req, res, next) {
        Promise.all([Types.find({}), Apps.findOne({ _id: req.params.id }),Equipments.find({})])
            .then(([type, app, equipmentList]) => {
                if(!app) return Promise.reject()

                res.render('manager/edit', {
                    app: singleMongooseToObj(app),
                    type: type[0].categoryTypeList,
                    typeGames: type[0].typeGames,
                    equipmentList: equipmentList[0].equipmentList,
                })
            })
            .catch(next)
    }

    //[PUT] /dashboard/app/:id/update
    async update(req, res, next) {
        var imgObj = req.files.img
        var imgdescArr = req.files.descImage
        var obj = {
            typeGame: req.body.typeGame ? req.body.typeGame : null,
            name: req.body.name,
            type: req.body.type,
            categoryType: req.body.categoryType,
            desc: req.body.desc,
            link: req.body.link,
            download: 0,
            price: Number(req.body.price),
            equipment: req.body.equipment,
            size: Math.floor(req.body.size),
            slug: slugify(req.body.name, {
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
            obj.img = `/upload/app/${req.body.name}/${imgObj[0].filename}`
        else
            obj.img = req.body.oldImg

        Apps.findOne({ _id: req.params.id })
            .then((data) => {
                if(!data) return Promise.reject()
                if(data.name!==obj.name)
                    renameFolder(data.name, obj.name, 'src/public/upload/app')
            })
            .catch(next)

        //Save new field 'descImage'
        var arr = req.body.descImageOld||[]
        if (imgdescArr) {
            imgdescArr.forEach(e => arr.push(`/upload/app/${req.body.name}/${e.filename}`))
        }
        obj.descImage = arr

        //Handle delete image
        if (req.body.imgDelete) {
            deleteFiles(req.body, 'src/public/upload/app')
        }
        
        //Save to DB
        Apps.updateOne({ _id: req.params.id }, obj)
            .then(() => res.redirect('/dashboard'))
            .catch(next)

    }

    //[GET] /dashboard/app/recycle
    recylePage(req, res, next) {
        var regex = new RegExp(`${req.query.keyword}`, 'i')

        Promise.all([
                Apps.find({ deletedAt: { $gte: new Date(1970, 0, 1) } }).sortable(req, res).paginationHandle(req, res),
                Apps.countDocuments({ deletedAt: { $gte: new Date(1970, 0, 1) } }),
                Apps.find({ deletedAt: { $gte: new Date(1970, 0, 1) }, name: regex }).sortable(req, res).paginationHandle(req, res),
                Apps.countDocuments({ deletedAt: { $gte: new Date(1970, 0, 1) }, name: regex }),
                Types.find({}),
            ])  
            .then(([app, countActive, appSearch, countSearch, types]) => {
                var objApp

                if (req.query.keyword) {
                    objApp = multiMongooseToObj(appSearch)
                    countActive = countSearch
                } else {
                    objApp = multiMongooseToObj(app)
                }

                res.render('manager/recycle', {
                    countActive,
                    isHadElement: countActive > 0 ? true : false,
                    types: types[0].categoryTypeList,
                    currentPage: res.locals.pagination.page,
                    pages: Math.ceil(countActive / res.locals.pagination.showPercent),
                    app: objApp,
                })
            })
            .catch((err) => console.log(err))
    }

    //[POST] /dashboard/app/recycle
    recycle(req, res, next) {
        switch (req.body.action) {
            case 'restore':
                Apps.updateMany({ _id: { $in: req.body.checkedList } }, { deletedAt: null })
                    .then(() => res.redirect('/dashboard/app/recycle'))
                    .catch((err) => console.log(err))
                break

            case 'delete':
                Promise.all([
                        Apps.find({ _id: { $in: req.body.checkedList } }),
                        Apps.deleteMany({ _id: { $in: req.body.checkedList } })
                    ])
                    .then(([data]) => {
                        data = multiMongooseToObj(data)
                        deleteFolders(data, 'src/public/upload/app')
                        res.redirect('/dashboard/app/recycle')
                    })
                    .catch((err) => console.log(err))
                break

            default:
                res.send('Lỗi')
        }

    }

    //[POST] /dashboard/app/handle-action-form
    handleActionForm(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Apps.updateMany({ '_id': { $in: req.body.checkedList } }, { deletedAt: Date.now() })
                    .then(() => res.redirect('/dashboard'))
                    .catch((err) => console.log(err))
                break

            default:
                res.send('Lỗi')
        }

    }

    //[GET] /dashboard/app/:id/restore
    restore(req, res, next) {
        Apps.updateOne({ _id: req.params.id }, { deletedAt: null })
            .then((data) => {
                if(!data) return Promise.reject()
                res.redirect('/dashboard/app/recycle')
            })
            .catch(next)
    }

    //[DELETE] /dashboard/app/recycle/:id/delete
    deleteForever(req, res, next) {
        Promise.all([
                Apps.findOne({ _id: req.params.id }),
                Apps.deleteOne({ _id: req.params.id })
            ])
            .then(([data]) => {
                if(!data) return Promise.reject()

                data = singleMongooseToObj(data)
                deleteFolder(data, 'src/public/upload/app')
                res.redirect('/dashboard/app/recycle')
            })
            .catch(next)
    }

}
module.exports = new AppsDashboardController()