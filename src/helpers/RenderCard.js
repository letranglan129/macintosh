const showPrice = require('./ShowPrice')
const formatTime = require('./FormatTime')
const { typeGame } = require('../ulti/variable')

module.exports = function (gameApps) {
    var htmlMain = ''
    var htmlInnerSubCard = ''
    var htmlInnerCardMini = ''

    
    const getSlug = (array, search) => array.find(element => element.type === search)
    const renderTypeGameCard = (typeArray) => typeArray.map(element => `<a href="/game/type${getSlug(typeGame, element).slug}" class="btn type-game-link">${element}</a>`).join('')


    gameApps.forEach((element, index) => {

        if (index == 0)
            htmlMain += `
            <div class="card-pic card h-100">
                <div class="card-img card-img-abs">
                    <a href="/app/${element.slug}" class="card-img-link h-100">
                        <img loading="lazy" src="${element.img}" alt="${element.name}" />
                    </a>
                </div>
                <div class="card-img-overlay">
                    <div class="type-game">
                        ${renderTypeGameCard(element.typeGame)}
                    </div>
                    <div class="name-game">
                        <a href="${element.slug}" class="name-game-link text-name">${element.name}</a>
                    </div>
                    <div class="info">
                        <span class="downloads"><i class="bi bi-download me-1"></i>${element.download} lượt tải</span>
                        <div class="app-button">
                            <a href="/app/${element.slug}" type="button" class="btn">Chi tiết</a>
                            <p class="app-price">${showPrice(element.price)}</p>
                        </div>
                    </div>
                </div>
            </div>
            `
        if (index >= 1 && index <= 3) {
            htmlInnerSubCard += `
            <div class="card card-pic">
                <div class="row g-0">
                    <div class="col-4">
                        <div class="card-img">
                            <a href="/app/${element.slug}" class="card-img-link h-100">
                                <img loading="lazy" src="${element.img}" />
                            </a>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="card-body justify-content-start justify-content-md-between">
                            <div class="type-game d-none d-md-block">
                                ${renderTypeGameCard(element.typeGame)}
                            </div>
                            <div class="name-game">
                                <a href="/app/${element.slug}" class="card-title text-name mb-2 mb-md-0">${element.name}</a>
                            </div>
                            <div class="info">
                                <span class="downloads"><i class="bi bi-download me-1"></i>${element.download} lượt tải</span>
                                <div class="app-button d-none d-md-block">
                                    <a href="/app/${element.slug}" type="button" class="btn">Chi tiết</a>
                                    <p class="app-price">${showPrice(element.price)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }

        if(index > 3) {
            htmlInnerCardMini += `
            <div class="card card-pic h-100 d-flex">
                <div class="card-img">
                    <a href="/app/${element.slug}" class="card-img-link">
                        <img loading="lazy" src="${element.img}" />
                    </a>
                </div>
                <div class="card-body">
                    <div class="type-game">${renderTypeGameCard(element.typeGame)}</div>
                    <div class="name-game">
                        <a href="${element.name}" class="card-title text-name fs-small">${element.name}</a>
                    </div>
                    <div class="info">
                        <span class="debut">Ra mắt: ${formatTime(element.createdAt)}</span>
                    </div>
                </div>
            </div>
            `
            
        }
        
    })

    return `<div class="game-new-list g-4 pb-4">
                ${htmlMain}
                <div class="sub-card-group align-content-start">
                    ${htmlInnerSubCard}
                </div>
            </div>
            <div class="play-more-list g-4">${htmlInnerCardMini}</div>
            `
}