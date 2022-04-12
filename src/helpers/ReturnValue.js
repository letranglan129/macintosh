module.exports = function (hbs) {
    return hbs ? JSON.stringify(hbs) : JSON.stringify({})
}