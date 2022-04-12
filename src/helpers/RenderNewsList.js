const formatTime = require('./FormatTime')
const formatDescNews = require('./FormatDescNews')

module.exports = function (element, times) {
    if (!element || element.length <= 3 || !Array.isArray(element)) return ''
    var htmlArr = []
    for (let i = 3; i < element.length; i++) {
        var html = `<div class="card card-pic mb-4">
                        <div class="row">
                            <div class="col-12 col-sm-6 g-0">
                                <div class="card-img">
                                    <a href="/news/${element[i].slug}" class="card-img-link rounded-end-0 absolute-img">
                                        <img loading="lazy" src="${element[i].img}"
                                            class="card-img-top rounded-0 absolute-img">
                                    </a>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 g-0">
                                <div class="card-body">
                                    <a href="/news/${element[i].slug}" class="card-title text-name">${element[i].titleNews}</a>
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
                                    <div class="card-text text-truncate-lines" style="--line: 3">${formatDescNews(element[i].desc)}</div>
                                </div>
                            </div>
                        </div>
                </div>`
        htmlArr.push(html)
    }
    return htmlArr.join('')
}