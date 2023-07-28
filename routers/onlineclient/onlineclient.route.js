const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware')

router.post('/client/register', auth, (req, res) => {
  require('./clients.route').register(req, res)
})

router.put('/client/update', auth, (req, res) => {
  require('./clients.route').update(req, res)
})

router.post('/client/getdoctors', auth, (req, res) => {
  require('./clients.route').getDoctors(req, res)
})

router.post('/client/getall', auth, (req, res) => {
  require('./clients.route').getClients(req, res)
})

module.exports = router
