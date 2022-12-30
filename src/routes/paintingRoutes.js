const {Router} = require('express')
const router = Router()

const {renderForm, listAllPaintings, processForm, deletePainting, hirePainting, processHirePainting} = require('../controllers/PaintingController')

router.get('/', listAllPaintings);

router.post('/new', processForm);

router.get('/new', renderForm);

router.get('/delete', deletePainting);

router.get('/hire', hirePainting);

router.post('/hire', processHirePainting)


module.exports = router;