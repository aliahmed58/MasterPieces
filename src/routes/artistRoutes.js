const {Router} = require('express')
const router = Router()
const {listAllArtists, generateReport, renderForm, processForm, deleteArtist} = require('../controllers/ArtistsController')


router.get('/', listAllArtists)

router.get('/report', generateReport)

router.get('/new', renderForm)

router.post('/new', processForm)

router.get('/delete', deleteArtist)

module.exports = router