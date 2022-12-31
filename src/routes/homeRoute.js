const {Router} = require('express');
const router = Router()

// require controllers
const {renderHomepage, renderHelpPage, renderAboutPage} = require('../controllers/HomeController')

router.get('/', renderHomepage)

router.get('/help', renderHelpPage);

router.get('/about', renderAboutPage);

module.exports = router
