const {Router} = require('express');
const router = Router()

// require controllers
const {renderHomepage} = require('../controllers/HomeController')

router.get('/', renderHomepage)

module.exports = router
