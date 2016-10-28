const express = require('express')
const router = express.Router()

router.get('/version', require('./get-version'))

module.exports = router
