const express = require('express')
const router = express.Router()
const appController = require('../app/controllers/AppController')
const errorMiddleware = require('../app/middleware/ErrorMiddleware')
const siteController = require('../app/controllers/SiteController')

router.get('/test', appController.test, errorMiddleware)
router.get('/:slug', appController.detail)
router.get('/', siteController.filter({categoryType: {$ne: 'game'}}))
router.all('*', errorMiddleware);

module.exports = router