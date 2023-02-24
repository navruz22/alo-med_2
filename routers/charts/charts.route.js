const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware')


router.post('/offline/monthly/get', auth, (req, res) => {
    require('./charts').getMonthly(req, res);
})

module.exports = router;