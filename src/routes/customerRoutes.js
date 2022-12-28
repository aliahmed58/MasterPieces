const {Router} = require('express')
const router = Router()
const {listAllCustomers, generateReport, renderForm} = require('../controllers/CustomerController')


router.get('/', listAllCustomers)

router.get('/report', generateReport)

router.get('/new', renderForm)

module.exports = router