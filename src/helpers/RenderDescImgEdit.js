module.exports = function renderDescImgEdit(app) {
    var html = []
    app.descImage.forEach((val, index) => {
        html.push(`<div class="me-4 mb-3 img-input">
                        <button type="button" class="btn del-btn"><i class="bi bi-x-circle"></i></button>
                        <label for="descImage${index}" >
                            <img loading="lazy" src="${val}" alt="" width="120px" height="120px" class="rounded-3">
                        </label>
                        <input type="text" class="desc-img form-control" id="descImage${index}" name="descImageOld[]"
                            autocomplete="off" value="${val}" hidden multiple/>
                    </div>`)
    })




    return html.join('')
}