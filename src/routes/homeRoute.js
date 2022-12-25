const {Router} = require('express');

const router = Router()

router.get('/', (req, res) => {
    res.render('../src/views/home', {
        name: 'ali',
        age: 12
    })
})

module.exports = router
