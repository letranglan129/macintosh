module.exports = function (types) {
    if(types.length == 0 || !types)
        return ''
        
    return types.map(type => 
        `
        <div class="form-check form-check-inline">
            <input class="form-check-input input-equipment" type="checkbox" id="${type.name}-checkbox" value="${type.name}" name="categoryType[]" >   
            <label class="form-check-label" for="${type.name}-checkbox">${type.name}</label>
        </div>
        `
        ).join('')

}