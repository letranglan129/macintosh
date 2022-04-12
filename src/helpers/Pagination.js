module.exports = function pagination(currentPage, pages, showPercent, sort) {
        if(pages <= 1) return ''
        
        var href = ''
        const pageItemSize = 7
        const avgPageItemSize = Math.floor(pageItemSize / 2)
        currentPage = parseInt(currentPage)
        pages = parseInt(pages)
        var start = currentPage > avgPageItemSize ? currentPage - avgPageItemSize : 1
        var pageItemHtml = []


        //Set href when turn on SORT
        if (sort.enabled) {
            var href = `?_sort&column=${sort.column}&type=${sort.type}`
        }
        if (sort.search && sort.enabled) {
            var href = `?_sort&column=${sort.column}&type=${sort.type}&keyword=${sort.search}`
        }
        if(sort.search && !sort.enabled) {
            var href = `?&keyword=${sort.search}`
        }


        


        //Get start point start and end of pagination
        if (currentPage + avgPageItemSize > pages) {
            var tmp = currentPage - 2 * avgPageItemSize + (pages - currentPage)
            start = tmp < 1 ? 1 : tmp
        }
        var end = start + 2 * avgPageItemSize > pages ? pages : start + 2 * avgPageItemSize

        //Loop itemPage
        for (var i = start; i <= end; i++) {
            var html = `<li class="page-item ${currentPage==i?'active':''}">
                            <a class="page-link" href="${href+`${href?'&':'?'}page=${i}`}&percent=${showPercent}">${i}</a>
                        </li>`
            pageItemHtml.push(html)
        }

        pageItemHtml = pageItemHtml.join('')

        //return HTLM
        var html = `<nav>
                        <ul class="pagination mb-0">
                            <li class="page-item ${currentPage==1?'disabled':''}">
                                <a class="page-link" href="${href+`${href?'&':'?'}page=${currentPage - 1}`}&percent=${showPercent}" aria-label="Previous">
                                    <span>&laquo;</span>
                                </a>
                            </li>
                            ${pageItemHtml}
                            <li class="page-item ${currentPage==pages?'disabled':''}">
                                <a class="page-link" href="${href+`${href?'&':'?'}page=${currentPage + 1}`}&percent=${showPercent}" aria-label="Next">
                                    <span>&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>`

        return html
}