const fs = require('fs/promises')
const path = require('path')


// Delete Folder
async function deleteFolder(files, pathToFolder) {
    
    if (files) {
        var folder = `${files.name.trim()}`

        try {
            var curDir = path.resolve(`${pathToFolder}/${folder}`)
            var filesAddress = await fs.readdir(curDir)
            for (let file of filesAddress) {
                await fs.unlink(path.resolve(`${pathToFolder}/${folder}/${file}`))
            }
            await fs.rmdir(path.resolve(`${pathToFolder}/${folder}`))

        } catch (err) {
            console.log('Folder không tồn tại hoặc xóa không thành công')
        }
    }
}

//Delete Item
async function deleleItems(files, pathToFolder) {
    var folder = `${files.name.trim()}`
    if (files.imgDelete[0]) {
    
        try {
            for (let file of files.imgDelete) {
                var filename = file.split('/')
                await fs.unlink(path.resolve(`${pathToFolder}/${folder}/${filename[filename.length - 1]}`))
            }
        } catch (err) {
            console.log('Xóa không thành công hoặc File không tồn tại')
        }
    }
}

//Rename Folder
async function renameFolder(nameOld, nameNew, pathToFolder) {
    var nameFolderOld = path.resolve(`${pathToFolder}/${nameOld}`)
    var nameFolderNew = path.resolve(`${pathToFolder}/${nameNew}`)
    
    try {
        await fs.rename(nameFolderOld, nameFolderNew)
    }catch(err) {
        console.log('Lỗi đổi tên')
    }

}

module.exports = {
    async deleteFolder(files, pathToFolder) {
        deleteFolder(files, pathToFolder)
    },

    async deleteFolders(files, pathToFolder) {
        files.forEach(file => {
            deleteFolder(file, pathToFolder)
        })
    },

    async deleteFiles(files, pathToFolder) {
        deleleItems(files, pathToFolder)
    },

    async  renameFolder(nameOld,nameNew, pathToFolder) {
        renameFolder(nameOld, nameNew)
    }
}