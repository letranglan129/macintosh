module.exports = function (data) {
    return data.split(/<[^>]+>/g).join('')
}