const {Router} = require('express')
const router = Router()
const {listAllOwners, generateReport} = require('../controllers/OwnerController')


router.get('/', listAllOwners)

router.get('/report', generateReport)

module.exports = router