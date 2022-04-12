module.exports = function renderSwiper(...argument) {

    var args = Array.from(argument)
    if (args[0]) {
        var htmls = []
        
        args[0].forEach((item, index) => {
            var html = `
            <div class="swiper-slide">
                <img loading="lazy" src="${item}"alt="" data-index="${index}"/>
            </div>
        `
            htmls.push(html)
        })
        return htmls.join('')
    }
    return
}