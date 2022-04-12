

module.exports = function (typeGames, app) {
    if(typeGames.length == 0|| !typeGames) 
        return '' 
    return typeGames.map(element => `
                <div class="form-check form-check-inline">
                    <input class="form-check-input me-1 input-equipment" type="checkbox"
                        ${app.typeGame ? app.typeGame.includes(element) ? 'checked' : '' : ''}
                        name="typeGame[]" id="${element.replace(/\s+/g, "")}" value="${element}">
                    <label for="${element.replace(/\s+/g, "")}">${element}</label>
                </div>`
    ).join('')
}