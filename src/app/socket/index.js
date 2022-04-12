const Apps = require('../models/Apps')
const Comments = require('../models/Comments')
const User = require('../models/User')
const News = require('../models/News')
const fs = require('fs')
const path = require('path')
const { deletePropertyUserMini, deletePropertyUserFull } = require('../../ulti/deleteProperty')

module.exports = function (io) {
    io.on('connection', socket => {

        //Handle comement
        socket.on('client-send-cmt', data => {
            var comment

            Comments.create(data)
                .then((data) => {
                    comment = data
                    return User.findOne({ _id: comment.userId })
                })
                .then(user => {
                    user = deletePropertyUserMini(user)
                    io.emit('server-send-cmt', { comment, user })
                })
                .catch((err) => console.log("Luu khong thanh cong"))
        })

        socket.on('like-action', data => {
            Comments.findOne({ _id: data.id })
                .then(comment => {
                    var userLiked = comment.userLiked
                    if (userLiked.indexOf(data.userId) === -1) {
                        userLiked.push(data.userId)
                    } else {
                        userLiked.splice(userLiked.indexOf(data.userId), 1)
                    }
                    io.emit('liked', { idComment: comment._id, userLiked })
                    return Comments.updateOne({ _id: comment._id }, { $set: { liked: userLiked.length, userLiked: userLiked } })
                })
                .then((err) => console.log("Đã like"))
                .catch((err) => console.log("Lỗi"))
        })

        socket.on('like-news-action', data => {
            News.findOne({ _id: data.id })
                .then(comment => {
                    var userLiked = comment.userLiked
                    if (userLiked.indexOf(data.userId) === -1) {
                        userLiked.push(data.userId)
                    } else {
                        userLiked.splice(userLiked.indexOf(data.userId), 1)
                    }
                    io.emit('liked-news', { idComment: comment._id, userLiked })
                    return News.updateOne({ _id: comment._id }, { $set: { liked: userLiked.length, userLiked: userLiked } })
                })
                .then(() => console.log("Đã like"))
                .catch(() => console.log("Lỗi"))
        })

        socket.on('client-reply', data => {
            var comment
            Comments.create(data)
                .then((data) => {
                    comment = data
                    return User.findOne({ _id: data.userId })
                })
                .then(data => {
                    data = deletePropertyUserMini(data)
                    io.emit('server-send-reply', [comment, data])
                })
                .catch((err) => console.log(err))

            
        })

        //Handle filter
        socket.on('filter', data => {

            if(data.isDeleteFilter) {
                deleteFilter = { deletedAt: { $gte: new Date(1970, 0, 1) } }
            } else {
                deleteFilter = { deletedAt: null }
            }

            //Add condition to array
            if (data.typeFilter === 'and') {
                var arrFilter = data.filterResult.map(a => ({ categoryType: a }))
                arrFilter.push(deleteFilter)

                Apps.find({ $and: arrFilter})
                    .then(data => socket.emit('filter-result', data))
                    .catch(err => console.log('loi'))
            } else {
                Apps.find({ categoryType: { $in: data.filterResult }, ...deleteFilter})
                    .then(data => socket.emit('filter-result', data))
                    .catch(err => console.log('loi'))
            }
        })

        //Delete one row
        socket.on('delete', id => {
            Apps.updateOne({ _id: id}, { deletedAt: Date.now() })
                .then(() => socket.emit('delete-result', true))
                .catch(() => socket.emit('delete-result', false))
        })

        socket.on('send-img', data => {
            function decodeBase64(dataString) {
                var response = {}
                var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)

                if(matches.length !== 3) {
                    return undefined
                }
                response.type = matches[1]
                response.file = matches[2]    

                return response
            }

            var imageTypeRegex = /\/(.*?)$/;  
            var imgBuffer = decodeBase64(data.imgBase64)
            var imgType = imgBuffer.type.match(imageTypeRegex)
            var imgName = data.name.split('.')[0]
            var path = `src/public/upload/img-general/img-${Date.now()}-${imgName}.${imgType[1]}`
            fs.writeFile(path, imgBuffer.file, 'base64', err => {
                if (err) {
                    console.log(err)
                    throw err
                }
                socket.emit('get-img', path.slice(10))  
            })


        })

        socket.on('load-next-news', (length, searchQueryUrl, isDeleted) => {
            var regex
            var obj
            if(searchQueryUrl.hasOwnProperty('keyword')) {
                regex = new RegExp(`${searchQueryUrl.keyword}`, 'i')
            }
            else
                regex = /\w+/g

            isDeleted ? obj = { $gte: new Date(1970, 0, 1) } : obj = null
            
            News.find({ deletedAt: obj, $or: [{ titleNews: regex }, { tag: regex },] }).sort({ createdAt: -1 }).skip(length).limit(9)
            .then((news) => {
                socket.emit('result-next-news', news)
            })
            .catch((err) => {
                console.log(err)
            })
        })
        
        socket.on('soft-delete-news', id => {
            News.updateOne({ _id: id }, { "$set": { deletedAt: Date.now() } }, (err, data) => {
                var result = true
                if(err) {
                    console.log(err)
                    result = false
                }
                socket.emit('result-soft-delete-news', {result, id})
            })
        })

        socket.on('load-next-game', (length, searchQueryUrl, isDeleted) => {
            var regex
            var obj
            if(searchQueryUrl.hasOwnProperty('keyword')) {
                regex = new RegExp(`${searchQueryUrl.keyword}`, 'i')
            }
            else
                regex = /\w+/g

            isDeleted ? obj = { $gte: new Date(1970, 0, 1) } : obj = null
            
            Apps.find({ deletedAt: obj, categoryType: 'game', typeGame: regex }).sort({ createdAt: -1 }).skip(length).limit(9)
            .then((game) => {
                socket.emit('result-next-game', game)
            })
            .catch((err) => {
                console.log(err)
            })
        })
        
        socket.on('get-search-element', (data) => {
            var keyword = new RegExp(data.keyword, 'i')
            
            switch(data.type) {
                case 'news':
                    Promise.all([
                        News.find({ deletedAt: null, $or: [{ titleNews: keyword }, { tag: keyword }] }).skip(data.length).limit(9),
                        News.countDocuments({ deletedAt: null, $or: [{ titleNews: keyword }, { tag: keyword }] }),
                    ])
                        .then(([news, count]) => {
                            socket.emit('send-search-result', { news, type: data.type, count, length: news.length })
                        })
                        .catch(err => console.log(err))
                    break


            }
        })

    })
}
