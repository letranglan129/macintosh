const showPrice = require('./ShowPrice')

module.exports = function (app) {
    if(app.img)
        return `<img loading="lazy" src="${app.img}" alt="${app.name}" />
                <div class="app-button d-flex d-md-none">
                    <button class="share-btn"><i class="bi bi-share-fill"></i></button>
                    <div class="button-group">
                        <a href="#" type="button" class="btn btn-large btn-bg">Tải về</a>
                        <p class="app-price">${showPrice(app.price)}</p>
                    </div>
                </div>
            `
    return
}