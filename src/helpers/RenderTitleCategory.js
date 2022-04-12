module.exports = function (types, path) {
    if(Array.isArray(types)) {
        var type = types.find(type => type.slug == path)
        if(!type) return `<h4 class="fw-bold mb-3">Tất cả App</h4>`
        else return `<h4 class="fw-bold mb-3">${type.title}</h4>`
    }
    return `<h4 class="fw-bold mb-3">${types.title}</h4>`
}