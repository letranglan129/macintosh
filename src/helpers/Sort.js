module.exports = function sort(field, sort, size) {
    var sortType = field === sort.column ? sort.type : 'default'
    var searchHref = sort.search ? `&keyword=${sort.search}` : ''
    const icons = {
        default: 'bi bi-chevron-expand',
        asc: 'bi bi-sort-down-alt',
        desc: 'bi bi-sort-down',
    }

    const types = {
        default: 'desc',
        asc: 'desc',
        desc: 'asc',
    }

    var icon = icons[sortType]
    var type = types[sortType]

    return `<a href="?_sort&column=${field}&type=${type}&page=1&percent=${size}${searchHref}" class="ms-3">
                <i class="${icon}"></i>
            </a>`
}