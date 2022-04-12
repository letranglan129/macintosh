module.exports = function renderEquipment(equipmentList, checkedList) {
    var htmls=[]
    if(Array.isArray(checkedList)) {
        var isSame = false
        equipmentList.forEach(item => {
            for(let checkedListItem of checkedList) {
                if(item === checkedListItem)
                    isSame= true
            }
            var html = `
                <div class="form-check form-check-inline">
                    <input class="form-check-input input-equipment" type="checkbox" id="${item}" ${isSame?'checked':''} value="${item}" name="equipment[]" >   
                    <label class="form-check-label" for="${item}">${item}</label>
                </div>
                `
            htmls.push(html)
            isSame = false
        })
    }else {
        equipmentList.forEach(item=> {
            html = `
            <div class="form-check form-check-inline">
                <input class="form-check-input input-equipment" type="checkbox" id="${item}" value="${item}" name="equipment[]" >   
                <label class="form-check-label" for="${item}">${item}</label>
            </div>
            `
            htmls.push(html)
        })
    }

    return htmls.join('')
}