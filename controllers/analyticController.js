const asyncHandler = require('express-async-handler')
const Order = require('../models/orderModel')

//Route : analytics/get-info
const getInfo = asyncHandler(async(req, res)=>{
    if(req.user !== null && req.user.isAdmin){
        const info = await Order.find()
        const totalOrders = info.length
        let totalRevenue = 0
        let totalDelivered = 0
        let totalPending = 0
        info.forEach(item=>{
            totalRevenue += item.totalPrice
            if(item.status === "Delivered"){
                totalDelivered += 1
            } 
            else{
                totalPending += 1
            }
        })
        res.json({totalRevenue, totalOrders, totalPending, totalDelivered}).status(200)
    }
    else{
        res.json({
            Status : "Failed",
            Message : "Not Authorized"
        }).status(400)
    }
})

module.exports = getInfo