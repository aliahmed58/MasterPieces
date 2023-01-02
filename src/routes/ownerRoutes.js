const {Router} = require('express')
const router = Router()
const {listAllOwners, generateReport, renderForm, processForm, deleteOwner, resubmitPainting, showEditForm, editOwner} = require('../controllers/OwnerController')


router.get('/', listAllOwners)

router.get('/report', generateReport)

router.get('/new', renderForm)

router.post('/new', processForm)

router.get('/delete', deleteOwner)

router.get('/report/resubmit', resubmitPainting)

router.get('/edit', showEditForm);

router.post('/edit', editOwner);

module.exports = router