const {Router} = require('express')
const router = Router()
const {listAllCustomers, generateReport, renderForm, processForm, deleteCustomer} = require('../controllers/CustomerController')


router.get('/', listAllCustomers)

router.get('/report', generateReport)

router.get('/new', renderForm)

router.post('/new', processForm)

router.get('/delete', deleteCustomer)

module.exports = router