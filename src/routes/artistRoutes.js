const {Router} = require('express')
const router = Router()
const {listAllArtists, generateReport, renderForm, processForm, deleteArtist, editArtist, showEditForm} = require('../controllers/ArtistsController')


router.get('/', listAllArtists)

router.get('/report', generateReport)

router.get('/new', renderForm)

router.post('/new', processForm)

router.get('/delete', deleteArtist)

router.get('/edit', showEditForm)

router.post('/edit', editArtist)

module.exports = router