const {Router} = require('express')
const router = Router()
const {listAllArtists, generateReport, renderForm, processForm} = require('../controllers/ArtistsController')


router.get('/', listAllArtists)

router.get('/report', generateReport)

router.get('/new', renderForm)

router.post('/new', processForm)

module.exports = router