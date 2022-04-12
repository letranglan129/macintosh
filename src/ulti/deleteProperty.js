module.exports  = {

    deletePropertyUserFull(data) {
        if(!data) return
        var element = JSON.parse(JSON.stringify(data))
    
        if(element && Array.isArray(element)) {
            element.forEach(element => {
                delete element?.[element.type].password
                delete element?.[element.type].email
                delete element?.[element.type].address
            })
        }
    
        if(element != null && typeof element == 'object') {
            delete element?.[element.type]?.password
            delete element?.[element.type]?.email
            delete element?.[element.type]?.address
        }
        return element
    },

    deletePropertyUserMini(data) {
        if(!data) return
        var element = JSON.parse(JSON.stringify(data))
    
        if(element && Array.isArray(element)) {
            element.forEach(element => {
                delete element?.password
                delete element?.email
                delete element?.address
            })
        }
    
        if(element != null && typeof element == 'object') {
            delete element?.password
            delete element?.email
            delete element?.address
        }
        return element
    },

}