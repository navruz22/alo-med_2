const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware')

//========================================================
// Clinica
router.post('/clinica/register', (req, res) => {
  require('./clinica.route').register(req, res)
})

router.get('/clinica', (req, res) => {
  require('./clinica.route').getClinica(req, res)
})

router.put('/clinica/update', (req, res) => {
  require('./clinica.route').update(req, res);
})

router.post('/clinica/delete', (req, res) => {
  require('./clinica.route').delete(req, res);
})

router.post('/clinica/filials/create', (req, res) => {
  require('./clinica.route').filialsCreate(req, res);
})

router.get('/clinica/mainclinica/get', (req, res) => {
  require('./clinica.route').getMainClinicas(req, res)
})

router.get('/clinica/getall', (req, res) => {
  require('./clinica.route').getAllClinicaForFilail(req, res);
})

router.post('/clinica/is_create_user', (req, res) => {
  require('./clinica.route').changeCreateUser(req, res);
})

//========================================================
//Director
router.post('/director/register', (req, res) => {
  require('./director.route').register(req, res)
})

router.post('/director/login', (req, res) => {
  require('./director.route').login(req, res)
})

router.post('/director', (req, res) => {
  require('./director.route').getDirector(req, res)
})

router.put('/director/update', (req, res) => {
  require('./director.route').update(req, res)
})

router.put('/director/updatepassword', (req, res) => {
  require('./director.route').updatePassword(req, res)
})

//========================================================
//User
router.post('/user/register', (req, res) => {
  require('./user.route').register(req, res)
})

router.post('/user/login', (req, res) => {
  require('./user.route').login(req, res)
})

router.post('/user/gettype', auth, (req, res) => {
  require('./user.route').getUserType(req, res)
})

router.post('/user/getall', (req, res) => {
  require('./user.route').getUsers(req, res)
})

router.post('/user/remove', (req, res) => {
  require('./user.route').removeUser(req, res)
})

router.post('/user/isone', (req, res) => {
  require('./user.route').changeOne(req, res)
})


// Admin
router.post('/admin/create_admin/post', (req, res) => {
  require('./admin').register(req, res);
})

router.post('/admin/login', (req, res) => {
  require('./admin').login(req, res);
})

router.get('/admin/clinica_list/get', (req, res) => {
  require('./clinica.route').getClinicaList(req, res)
})



module.exports = router
