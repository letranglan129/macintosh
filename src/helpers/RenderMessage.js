module.exports = function (err, type) {

   if(err) {

    Array.isArray(err) ? err : err = [].concat(err)
    
    switch(type) {
        case 'warning': 
            return err.map(item => 
                    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                        <div style="font-size: 13px">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="1.5" viewBox="0 0 24 24" fill="none">
                            <path d="M20.0429 21H3.95705C2.41902 21 1.45658 19.3364 2.22324 18.0031L10.2662 4.01533C11.0352 2.67792 12.9648 2.67791 13.7338 4.01532L21.7768 18.0031C22.5434 19.3364 21.581 21 20.0429 21Z" stroke="currentColor" stroke-linecap="round"/>
                            <path d="M12 9V13" stroke="currentColor" stroke-linecap="round"/>
                            <path d="M12 17.01L12.01 16.9989" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg> 
                            ${item.msg ? item.msg : item}
                        </div>
                        <button type="button" style="font-size: 13px" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`
                ).join('')
            break
        case 'danger':
            return err.map(item=> 
                `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    <div style="font-size: 13px">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="1.5" viewBox="0 0 24 24" fill="none">
                        <path d="M20.0429 21H3.95705C2.41902 21 1.45658 19.3364 2.22324 18.0031L10.2662 4.01533C11.0352 2.67792 12.9648 2.67791 13.7338 4.01532L21.7768 18.0031C22.5434 19.3364 21.581 21 20.0429 21Z" stroke="currentColor" stroke-linecap="round"/>
                        <path d="M12 9V13" stroke="currentColor" stroke-linecap="round"/>
                        <path d="M12 17.01L12.01 16.9989" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg> 
                        ${item.msg ? item.msg : item}
                    </div>
                    <button type="button" style="font-size: 13px" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`
            ).join('')
            break
        case 'success':
            return err.map(item=> 
                `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    <div style="font-size: 13px">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="1.5" viewBox="0 0 24 24" fill="none">
                        <path d="M20.0429 21H3.95705C2.41902 21 1.45658 19.3364 2.22324 18.0031L10.2662 4.01533C11.0352 2.67792 12.9648 2.67791 13.7338 4.01532L21.7768 18.0031C22.5434 19.3364 21.581 21 20.0429 21Z" stroke="currentColor" stroke-linecap="round"/>
                        <path d="M12 9V13" stroke="currentColor" stroke-linecap="round"/>
                        <path d="M12 17.01L12.01 16.9989" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg> 
                        ${item.msg ? item.msg : item}
                    </div>
                    <button type="button" style="font-size: 13px" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`
            ).join('')
            break

    }
   }
}