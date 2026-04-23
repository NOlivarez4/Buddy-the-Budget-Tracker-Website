const express = require('express')
const router = express.Router()
const { getSiteData } = require('../controllers/apiController')

router.get('/', getSiteData)

module.exports = router