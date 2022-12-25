const {Router} = require('express')
const router = Router()
const {listAllArtists, generateReport} = require('../controllers/ArtistsController')


router.get('/', listAllArtists)

router.get('/report', generateReport)

module.exports = router