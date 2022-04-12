module.exports = function (types) {

    return types.map(type => 
        `
        <div class="d-inline-block w-50">
            <input class="form-check-input me-1" role="button" id="category-${type.name}-filter" type="checkbox" name="value-filter[]" value="${type.name}">
            <label for="category-${type.name}-filter" role="button">${type.name}</label>
        </div>
        `
        ).join('')

}