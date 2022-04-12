const showPrice = require('./ShowPrice')

module.exports = function (apps) {
    if(apps.length == 0) {
        return  `   <div class="col-4">
                        <div class="text-center"><img loading="lazy" loading="lazy" src="./img/no-result.png" alt="" width="100%"></div>
                    </div>
                    <div class="col-8">
                        <div class="d-flex align-items-center h-100">
                            <div>
                                <h1>Oops!!!</h1>
                                <h2>Rất tiếc mục này chưa có app nào</h2>
                                <p><a href="">Nhấp vào đây </a>để gửi yêu cầu thêm app</p>
                            </div>
                        </div>
                    </div>`
    }
    else {
        return apps.map(app => 
            `
            <div class="col-lg-4 col-sm-6 col-12">
                <div class="app-item">
                    <div class="app-link">
                        <a href="/app/${app.slug}" class="app-image">
                            <img loading="lazy" loading="lazy" src="${app.img}" />
                        </a>
                        <div class="app-text">
                            <a href="/app/${app.slug}" class="card-title text-name">${app.name}</a>
                            <p class="app-text-type">${app.type}</p>
                        </div>
                    </div>
                    <div class="app-button">
                        <a href="/app/${app.slug}" type="button" class="btn">Chi tiết</a>
                        <p class="app-price">${showPrice(app.price)}</p>
                    </div>
                </div>
            </div>
            `
            ).join('')
    }
}