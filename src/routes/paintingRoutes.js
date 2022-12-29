const {Router} = require('express')
const router = Router()

const {renderForm, listAllPaintings, processForm, deletePainting} = require('../controllers/PaintingController')

router.get('/', listAllPaintings);

router.post('/new', processForm);

router.get('/new', renderForm);

router.get('/delete', deletePainting);


module.exports = router;