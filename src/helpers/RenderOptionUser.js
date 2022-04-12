const { ROLE } = require('../app/middleware/IsAuthenticatedMiddleware')

module.exports = function (user) {
    
    var noneUserOption = [
        {
            title: 'Đăng nhập',
            link: '/user/login',
            icon: 'bi bi-person-circle',
        },
        {
            title: 'Đăng ký',
            link: '/user/register',
            icon: 'bi bi-person-plus',
        },
    ]
    
    var userOption = [
        {
            title: 'Thông tin cá nhân',
            link: '/user/profile',
            icon: 'bi bi-person-fill',
        },
        {
            title: 'Đã lưu',
            link: '',
            icon: 'bi bi-bookmark-fill',
        },
        {
            title: 'Đã tải xuống',
            link: '',
            icon: 'bi bi-save-fill',
        },
        {
            title: 'Hỗ trợ',
            link: '',
            icon: 'bi bi-headset',
        },
        {
            title: 'Quản lý app',
            link: '/dashboard',
            icon: 'bi bi-folder-fill',
        },
        {
            title: 'Cài đặt',
            link: '',
            icon: 'bi bi-gear-wide-connected',
        },
        {
            title: 'Yêu cầu thêm App',
            link: '',
            icon: 'bi bi-app-indicator',
        },
        {
            title: 'Đăng xuất',
            link: '/user/logout',
            icon: 'bi bi-box-arrow-right',
        },
    ]

    if(user) {
        //Gán lại user cho đúng kiểu đăng nhập
        //Xóa option cho tài khoản không có quyền truy cập
        var role = []
        for(let key in ROLE) {
            role.push(ROLE[key])
        }

        if(!role.includes(user.access)) {
            var indexManager = userOption.findIndex((el) => el.title === 'Quản lý app')
            userOption.splice(indexManager, 1)
        }

        var htmls = userOption.map(item => 
            `<li class="item">
                <a href="${item.link}">
                    <div class="link px-3 py-2">
                        <i class="${item.icon}"></i>
                        ${item.title}
                    </div>
                </a>
            </li>`
        ).join('')
        return `<span class="avatar ms-3 order-1 position-relative">
                    <img loading="lazy" src="${user.avatar}" class="w-100 h-100 rounded-circle">
                    <ul class="user-control">
                        ${htmls}
                    </ul>
                </span>`
    } 

    var htmls = noneUserOption.map(item => 
        `<li class="item">
            <a href="${item.link}">
                <div class="link px-3 py-2">
                    <i class="${item.icon}"></i>
                    ${item.title}
                </div>
            </a>
        </li>`
    ).join('')

    return `<span class="avatar ms-3 order-1 position-relative">
                <img loading="lazy" src="/img/user-icon.svg" class="w-100 h-100 rounded-circle">
                <ul class="user-control">
                    ${htmls}
                </ul>
            </span>`
}