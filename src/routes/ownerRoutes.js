const {Router} = require('express')
const router = Router()
const {listAllOwners, generateReport, renderForm} = require('../controllers/OwnerController')


router.get('/', listAllOwners)

router.get('/report', generateReport)

router.get('/new', renderForm)

module.exports = router