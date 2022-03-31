const express = require('express')
const updateOrderStatus = require('../controllers/orderController')
const protect = require('../middleware/authMiddleware')

const orderRouter = express.Router()

orderRouter.put('/update-status/:orderId', protect, updateOrderStatus)

module.exports = orderRouter