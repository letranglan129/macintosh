const formatTime = require('./FormatTime');
const formatDescNews = require('./FormatDescNews')
module.exports = function (element, times) {
    if(!element || element == 0 || !Array.isArray(element)) return ''
    var length = element.length  > times ? times : element.length
    var htmlArr = []
    for (let i = 0; i < length; i++) {
        var html = `<div class="swiper-slide align-self-stretch h-auto">
                        <div class="card card-pic h-100">
                            <div class="row h-100">
                                <div class="col-lg-8 col-md-6 col-12 g-0">
                                    <div class="card-img align-items-start">
                                        <a href="/news/${element[i].slug}" class="card-img-link rounded-end-0 absolute-img">
                                            <img loading="lazy" src="${element[i].img}"
                                                class="card-img-top rounded-0 absolute-img">
                                        </a>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-12 g-0">
                                    <div class="card-body">
                                        <a href="/news/${element[i].slug}" class="card-title text-name">
                                        ${element[i].titleNews}
                                        </a>
                                        <div class="info justify-content-start mb-3">
                                            <div class="author">
                                                <div class="avatar">
                                                    <img loading="lazy" src="${element[i].user.avatar}" width="40px" class="rounded-circle">
                                                </div>
                                                <div class="name">${element[i].user.name}</div>
                                            </div>
                                            <i class="bi bi-circle-fill" style="font-size: 8px;margin: 0 12px;"></i>
                                            <div class="debut">${formatTime(element[i].createdAt)}</div>
                                        </div>
                                        <div class="card-text text-truncate-lines" style="--line: 6">
                                            ${formatDescNews(element[i].desc)}
                                        </div>
                                        <div class="app-button">
                                            <a href="/news/${element[i].slug}" class="btn white-border fs-6 p-2 my-2">Xem thêm</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
        htmlArr.push(html)
    }
    return htmlArr.join('')
}