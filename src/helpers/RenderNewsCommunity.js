const { newsCommunity } = require('../ulti/variable')

module.exports = function () {
    return newsCommunity.map(element => `<div class="col-6 col-lg-12 mb-3">
                                            <div class="card card-pic bg-transparent">
                                                    <div class="row">
                                                        <div class="col-12 col-sm-6">
                                                            <div class="card-img">
                                                                <a href="" class="card-img-link h-auto">
                                                                    <img loading="lazy" src="${element.img}"
                                                                        class="card-img-top rounded-0">
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div class="col-12 col-sm-6 g-0">
                                                            <div class="card-body  bg-transparent">
                                                                <a href="" class="card-title text-name">${element.name}</a>
                                                                <p>${element.tag}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                        </div>`).join('')
}