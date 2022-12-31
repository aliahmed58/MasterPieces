const {Router} = require('express');
const router = Router()

// require controllers
const {renderHomepage, renderHelpPage} = require('../controllers/HomeController')

router.get('/', renderHomepage)

router.get('/help', renderHelpPage);

module.exports = router
