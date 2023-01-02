const {Router} = require('express')
const router = Router()

const {renderForm, listAllPaintings, processForm, deletePainting, hirePainting, processHirePainting, returnPainting, showEditForm, editPainting} = require('../controllers/PaintingController')

router.get('/', listAllPaintings);

router.post('/new', processForm);

router.get('/new', renderForm);

router.get('/delete', deletePainting);

router.get('/hire', hirePainting);

router.post('/hire', processHirePainting)

router.get('/return', returnPainting);

router.get('/edit', showEditForm)

router.post('/edit', editPainting)


module.exports = router;