const ROLE = {
    ADMIN: 'admin',
    WRITE: 'writer',
    MONDERATOR: 'monderator',
}

const authMiddleware = {
    //Check not login redirect login page
    authUser() {
        return (req, res, next) => {
            if (req.isAuthenticated())
                next()
            else {
                req.flash('error', 'Vui lòng đăng nhập')
                res.redirect('/user/login')
            }
        }
    },

    //Check logged redirect home page
    authLogged() {
        return (req, res, next) => {
            if (!req.isAuthenticated())
                next()
            else {
                res.redirect('/')
            }
        }
    },

    //Authorization user
    authRole(role) {
        return (req, res, next) => {
            var roleArr = []

            if(typeof role === 'object') {
                for(let key in role)
                    roleArr.push(role[key])
                role = roleArr
            }

            if (!role.includes(res.locals.userSer.access)) {
                res.status(403)
                res.json('không có quyền truy cập')
            } else {
                next()
            }
        }
    },

    //Check path /dashboard/...
    isDashboard() {
        return (req, res, next) => {
            var isDashboard = req.originalUrl.split('/').includes('dashboard')
            res.locals.isDashboard = isDashboard
            next()
        }
    },
}

module.exports = {
    ROLE,
    authMiddleware,
}