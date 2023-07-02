const express = require("express")
const app = express()
const handlebars = require("express-handlebars")
const path = require("path")
const route = require("./routes")
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const bodyParser = require('body-parser')

const sortMiddleware = require("./app/middleware/SortMiddleware")
const paginationMiddleware = require("./app/middleware/PaginationMiddleware")
const userMiddleware = require("./app/middleware/UserMiddleware")


const db = require("./config/db")
const user = require('./config/passport/passport')
const userGoogle = require('./config/passport/passport-google')
const userFacebook = require('./config/passport/passport-facebook')

//Socket.io realtime
const server = require('http').createServer(app)
const io = require('socket.io')(server)

require('dotenv').config()
//PORT
const port = process.env.PORT || 3000

//Connect to DB
db.connect()

//Method Override 
app.use(methodOverride('_method'))

//Path static
app.use(express.static(path.join(__dirname, "public")))

//Check User
userFacebook(passport)
userGoogle(passport)
user.checkUser(passport)


//Middleware
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(flash())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(sortMiddleware)
app.use(paginationMiddleware)
app.use(userMiddleware)

//Template Engine
app.engine(
	".hbs",
	handlebars({
		layoutsDir: "",
		extname: ".hbs",
		helpers: {
			sum: (a, b) => a + b,
			formatTime: require("./helpers/FormatTime"),
			sort: require("./helpers/Sort"),
			paginationHandle: require("./helpers/Pagination"),
			itemPerPage: require("./helpers/ItemPerPage"),
			renderDescImgEdit: require("./helpers/RenderDescImgEdit"),
			renderEquipment: require("./helpers/RenderEquipment"),
			renderSwiper: require("./helpers/RenderSwiper"),
			showPrice: require("./helpers/ShowPrice"),
			returnErrorValue: require("./helpers/ReturnErrorValue"),
			renderMessage: require("./helpers/RenderMessage"),
			renderOptionUser: require("./helpers/RenderOptionUser"),
			showItemForm: require("./helpers/ShowItemForm"),
			returnValue: require("./helpers/ReturnValue"),
			renderComments: require("./helpers/RenderComments"),
			renderFilterItem: require("./helpers/RenderFilterItem"),
			renderCategoryListCreate: require("./helpers/RenderCategoryListCreate"),
			renderTitleCategory: require("./helpers/RenderTitleCategory"),
			renderAppItem: require("./helpers/RenderAppItem"),
			renderAppImg: require("./helpers/RenderAppImg"),
			renderCard: require("./helpers/RenderCard"),
			renderTypeGame: require("./helpers/RenderTypeGame"),
			formatDescNews: require("./helpers/FormatDescNews"),
			checkedItem: require("./helpers/CheckedItem"),
			loopSliderNews: require("./helpers/LoopSliderNews"),
			renderNewsList: require("./helpers/RenderNewsList"),
			renderNewsCommunity: require("./helpers/RenderNewsCommunity"),
			renderCardNews: require("./helpers/RenderCardNews"),
			renderLinkTypeGame: require("./helpers/RenderLinkTypeGame"),
		},
	})
)
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "/resources/views"))

//Route
route(app)


//Socket IO function
require('./app/socket/index')(io)
server.listen(port, () => console.log(`http://localhost:${port}`))