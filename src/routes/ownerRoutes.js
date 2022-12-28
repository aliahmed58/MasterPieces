const {Router} = require('express')
const router = Router()
const {listAllOwners, generateReport, renderForm, processForm} = require('../controllers/OwnerController')


router.get('/', listAllOwners)

router.get('/report', generateReport)

router.get('/new', renderForm)

router.post('/new', processForm)

module.exports = router