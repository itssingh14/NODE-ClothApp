const Order = require('../models/orderModel')
const asyncHandler = require('express-async-handler')

//Route : orders/update-status/:orderId
const updateOrderStatus = asyncHandler(async(req, res)=>{ 
    if(req.user !== null && req.user.isAdmin){
        const {status} = req.body
        if(!status){
            res.json({
                Status : "Failed",
                Message : "Enter status"
            }).status(400)
            return
        }
        const order = await Order.findById(req.params.orderId)
        if(!order){
            res.json({
                Status : "Failed",
                Message : "Order not Found"
            }).status(400)
        }
        else{
            order.status = status
            const updatedStatus = await order.save()
            if(!updatedStatus){
                res.json({
                    Status : "Failed",
                    Message : "Failed to update status"
                }).status(500)
            }
            else{
                res.json({
                    Status : "Success",
                    Message : "Order status updated"
                }).status(200)
            }
        }
    }
    else{
        res.json({
            Status : "Failed",
            Message : "Not Authorized"
        })
    }
})

module.exports = updateOrderStatus