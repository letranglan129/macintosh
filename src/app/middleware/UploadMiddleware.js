const multer = require('multer')
const fs = require('fs/promises')
const path = require('path')
const { nanoid } = require('nanoid')



function multerStorage(type) {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            var folderItem

            switch (type) {
                case 'app':
                    folderItem = `${req.body.name}`
                    break
                case 'user':
                    folderItem = `${req.user._id}`
                    break
                case 'news':
                    req.postNewsId = `${req.body?.id ?? nanoid()}`
                    folderItem = `${req.postNewsId}`
                    break
            }

            var address = `src/public/upload/${type}/${folderItem}`
            fs.mkdir(path.resolve(`${address}`))
                .then(() => console.log('Tạo folder thành công'))
                .catch((err) => {
                    console.log(err)
                    console.log('Folder đã tồn tại hoặc tạo folder không thành công')
                })
            
            cb(null, address)
        },

        filename: (req, file, cb) => {
            cb(null, `img-${Date.now()}-${file.originalname}`)
        },
    })
}

const multerFilter = (req, file, cb) => {
    var isImage = ["png", "jpg", "jpeg", "svg+xml", "gif", 'webp'].includes(file.mimetype.split("/")[1]) || ["image"].includes(file.mimetype.split("/")[0])
    if (isImage) {
        cb(null, true)
    } else {
        cb(new Error("Not a img File!!"), false)
    }
};

module.exports = function upload(type) {
    return multer({
        storage: multerStorage(type),
        limits: {
            fieldSize: 100 * 1024 * 1024,
            fileSize: 100 * 1024 * 1024,
            fieldNameSize: 100 * 1024 * 1024,
        },
        fileFilter: multerFilter,
    })
}
