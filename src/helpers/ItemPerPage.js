module.exports = function itemPerPage(size) {
        var sizeArr = [15, 20, 30, 50]
        var htmls = []

        for (let val of sizeArr) {
            htmls.push(`<option  role="button" value="${val}" ${val== size?`selected`:''}>${val}</option>`)
        }

        return htmls.join('')
}