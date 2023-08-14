const express = require('express')
const router = express.Router()
const companyController = require('../controllers/company.controller.js')



router.get('/', companyController.showAllCompany)
router.get('/add', companyController.showAddCompany)
router.post('/add', companyController.addCompany)
router.get('/:id', companyController.showCompany)
router.get('/:id/studentApi', companyController.studentApi)
router.get('/:id/addRound', companyController.addRound)
router.post('/:id', companyController.roundResult)
router.post('/:id/comment', companyController.addComment)
router.delete('/:id', companyController.deleteCompany)
router.post('/:id/finaliseRound', companyController.finaliseRound)

module.exports = router