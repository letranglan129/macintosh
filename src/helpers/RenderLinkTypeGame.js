const { typeGame } = require("../ulti/variable")

module.exports = function (types) {
    return types.map((type) => {
        var x = typeGame.find(element => element.type === type)
        return `<a href="/game/type${x.slug}" class="btn type-game-link">${x.type}</a>`
    }).join('')
}
