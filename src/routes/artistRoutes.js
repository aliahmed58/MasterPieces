const {Router} = require('express')
const router = Router()
const {listAllArtists, generateReport, renderForm} = require('../controllers/ArtistsController')


router.get('/', listAllArtists)

router.get('/report', generateReport)

router.get('/new', renderForm)

module.exports = router