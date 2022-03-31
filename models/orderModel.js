const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
    {
        user : {type : mongoose.Schema.Types.ObjectId, required : true, ref : "Users"},
        products : {type : Array, required : true},
        status : {type : String, required : false, default : "Pending"},
        totalPrice : {type : Number, required : true}
    },
    {timestamps : true}
)

const Order = mongoose.model('Orders', orderSchema)

module.exports = Order