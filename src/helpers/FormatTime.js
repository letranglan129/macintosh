module.exports = function(time, format) {
    var todayTime = new Date(time)
    var month = todayTime.getMonth() + 1
    var day = todayTime.getDate()
    var year = todayTime.getFullYear()
    var hours = todayTime.getHours()
    var min = todayTime.getMinutes()
    var sec = todayTime.getSeconds()
    switch (format) {
        case 'dd/mm/yyyy': 
            return `${day}/${month}/${year}`
            break
        case 'dd/mm/yyyy h/m/s':
            return `${day}/${month}/${year} ${hours}:${min}:${sec}`
            break
        default:
            return `${day}/${month}/${year}`
            break
    }
}