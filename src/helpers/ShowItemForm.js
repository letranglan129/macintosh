module.exports = (currentPage, pages, showPercent, countActive) => {
    if(pages == 1) return ''
    var end = currentPage * showPercent > countActive ? countActive : currentPage * showPercent
    var start = currentPage * showPercent - showPercent < 1 ? 1 : currentPage * showPercent - showPercent
    
    return `<p class="show-percent m-0">Showing ${start} to ${end} of ${countActive} entries</p>`
}