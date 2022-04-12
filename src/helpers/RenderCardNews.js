const formatDescNews = require('./FormatDescNews')
const formatTime = require('./FormatTime')

module.exports = function (news) {
    var htmlMain = ''
    var htmlInnerSubCard = ''

    news.forEach((element, index) => {

        if (index == 0)
            htmlMain += `
            <div class="card card-pic">
                <div class="card-img">
                    <a href="/news/${element.slug}" class="card-img-link h-auto">
                    <img loading="lazy"
                        src="${element.img}"
                        class="card-img-top" alt="${element.titleNews}" />
                    </a>
                </div>
                <div class="card-body">
                    <a href="/news/${element.slug}" class="card-title text-name">${element.titleNews}</a>
                    <div class="info justify-content-start mb-3">
                        <div class="author">
                            <div class="avatar">
                                <img loading="lazy" src="${element.user.avatar}" width="32px" class="rounded-circle" />
                            </div>
                            <div class="name">${element.user.name}</div>
                        </div>
                        <i class="bi bi-circle-fill" style="font-size: 8px;margin: 0 12px;"></i>
                    <div class="debut">${formatTime(element.createdAt)}</div>
                    </div>
                    <div class="card-text text-truncate-lines" style="--line: 4">${formatDescNews(element.desc)}</div>
                </div>
            </div>
            `
        if (index >= 1) {
            htmlInnerSubCard += `
            <div class="card card-pic">
                <div class="row g-0">
                    <div class="col-4">
                        <div class="card-img">
                            <a href="/news/${element.slug}" class="h-100 card-img-link">
                                <img loading="lazy" src="${element.img}" />
                            </a>
                        </div>

                    </div>
                    <div class="col-8">
                        <div class="card-body">
                            <a href="/news/${element.slug}" class="card-title text-name">${element.titleNews}</a>
                            <p class="card-text">23/06/2021</p>
                        </div>
                    </div>
                </div>
            </div>
            `
        }

    })

    return `<div class="news-list g-4">
                <div class="news-item-lg">
                    <div class="d-flex align-items-center justify-content-between mb-lg-4 mb-3">
                        <h4 class="topic-title fw-bold">Tin tức</h4>
                    </div>
                    ${htmlMain}
                </div>

                <div class="news-item-sm-list">
                    <div class="d-flex align-items-center justify-content-between mb-lg-4 mb-3">
                    <h4 class="topic-title fw-bold">Liên quan</h4>
                </div>

                <div class="news-item-sm">
                    ${htmlInnerSubCard}
                    <div class="app-button">
                    <a href="" class="btn w-100 fs-6 py-2 px-0 white-border">Xem tất cả</a>
                    </div>
                </div>

            </div>`
}



