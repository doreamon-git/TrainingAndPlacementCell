const express = require('express')
const router = express.Router()
const manageTPOController = require('../controllers/manageTPO.controller.js')


router.get('/', manageTPOController.show)
router.post('/addTPO', manageTPOController.addTPO)
router.delete('/removeTPO/:id', manageTPOController.removeTPO)


module.exports = router