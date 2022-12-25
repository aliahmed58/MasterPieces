const {Router} = require('express')
const router = Router()
const {listAllCustomers, generateReport} = require('../controllers/CustomerController')


router.get('/', listAllCustomers)

router.get('/report', generateReport)

module.exports = router