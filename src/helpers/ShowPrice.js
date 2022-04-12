module.exports = function showPrice(price) {

    var price = Number(price)
    if(price === 0) 
        return 'Miễn phí'
    return price
}