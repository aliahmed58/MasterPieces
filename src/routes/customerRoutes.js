const {Router} = require('express')
const router = Router()
const {listAllCustomers, generateReport, renderForm, processForm} = require('../controllers/CustomerController')


router.get('/', listAllCustomers)

router.get('/report', generateReport)

router.get('/new', renderForm)

router.post('/new', processForm)

module.exports = router