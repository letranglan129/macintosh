const express = require("express")
const router = express.Router()

const siteController = require('../app/controllers/SiteController')
const errorMiddleware = require('../app/middleware/ErrorMiddleware')

router.get('/search/app', siteController.search)
router.get('/of-mac-m1', siteController.filter({categoryType: 'ofMacM1'}))
router.get('/filmmaking', siteController.filter({categoryType: 'filmmaking'}))
router.get('/office', siteController.filter({categoryType: 'office'}))
router.get('/graphics', siteController.filter({categoryType: 'graphics'}))
router.get('/dev', siteController.filter({categoryType: 'dev'}))
router.get('/relax', siteController.filter({categoryType: 'relax'}))
router.get('/game/type/:slug', siteController.typeGamePage)
router.get('/game', siteController.filter({categoryType: 'game'}))
router.get('/news/:slug', siteController.newsItemPage)
router.get('/api/type-game', siteController.apiTypeGame)
router.get('/news', siteController.news)
router.get('/', siteController.homePage)
router.get('*', errorMiddleware);

module.exports = router