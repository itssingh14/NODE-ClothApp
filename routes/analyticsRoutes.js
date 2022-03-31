const express = require('express')
const getInfo = require('../controllers/analyticController')
const protect = require('../middleware/authMiddleware')

const analyticRouter = express.Router()

analyticRouter.get("/get-info", protect, getInfo)

module.exports = analyticRouter