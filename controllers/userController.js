const User = require('../models/userModel')
const Product = require('../models/productModel')
const Order = require('../models/orderModel')
const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken')
const fs = require('fs')
const req = require('express/lib/request')
const res = require('express/lib/response')
const imagePath = './userUploads/'

//Route : /user/register
const registerUser = asyncHandler(async(req, res)=>{
    const {name, email, password, isAdmin} = req.body
    const userImage = req.file.filename
    if(!name || !email || !password){
        res.json({
            Status : "Failed",
            Message : "Enter details"
        }).status(400)
        fs.unlink(imagePath+userImage, err=>{
            if(err){
                console.log(err)
                return
            }
        })
        return
    }
    const userExists = await User.findOne({email})
    if(userExists){
        res.json({
            Status : "Failed",
            Message : "User already registered"
        }).status(400)
        fs.unlink(imagePath+userImage, err=>{
            if(err){
                console.log(err)
                return
            }
        })
        return
    }
    
    const user = await User.create({
        name,
        email,
        password,
        userImage,
        isAdmin
    })
    if(!user){
        res.json({
            Status : "Failed",
            Message : "User registration failed"
        }).status(500)
        fs.unlink(imagePath+userImage, err=>{
            if(err){
                console.log(err)
                return
            }
        })
        return
    }
    res.json({
        name : user.name,
        email : user.email,
        userImage : user.userImage,
        token : generateToken(user._id)
    }).status(201)
})

//Route : /user/login
const authUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        res.json({
            Status : "Failed",
            Message : "Enter details"
        }).status(400)
        return
    }
    const user = await User.findOne({email})
    if(!user){
        res.json({
            Status : "Failed",
            Message : "User not found"
        }).status(400)
        return
    }
    const matchPassword = await user.matchPassword(password)
    if(!matchPassword){
        res.json({
            Status : "Failed",
            Message : "Enter valid credentials"
        }).status(400)
    }
    else{
        res.json({
            name : user.name,
            email : user.email,
            userImage : user.userImage,
            cart : user.cart,
            token : generateToken(user._id)
        }).status(200)
    }
})

//Route : /user/add-to-cart/:productId
const addToCart = asyncHandler(async(req, res)=>{
    if(req.user !== null){
        const {quantity} = req.body
        if(!quantity){
            res.json({
                Status : "Failed",
                Message : "Quantity not provided"
            }).status(400)
            return
        }
        const user = await User.findById(req.user._id)
        const product = await Product.findById(req.params.productId)
        if(!product){
            res.json({
                Status : "Failed",
                Message : "Product not found"
            }).status(404)
        }
        else{
            const index = user.cart.findIndex(item=>item.productId.toString()===req.params.productId.toString())
            if(index > -1){
                user.cart[index].quantity += Number(quantity)
                user.cart[index].totalPrice = Number(user.cart[index].quantity) * Number(product.price)
            }
            else{
                user.cart.push({
                    productId : product._id,
                    productName : product.name,
                    productPrice : product.price,
                    quantity,
                    totalPrice :  (Number(quantity) * Number(product.price))
                })
            }
            const savedCart = await user.save()
            if(!savedCart){
                res.json({
                    Status : "Failed",
                    Message : "Failed to add to cart"
                }).status(500)
            }
            else{
                res.json({
                    Status : "Success",
                    Message : "Added to cart"
                }).status(200)
            }
        }
    }
    else{
        res.json({
            Status : "Failed",
            Message : "User not loggedin"
        }).status(500)
    }
})

//Route : /user/place-order
const placeOrder = asyncHandler(async(req, res)=>{
    if(req.user !== null){
        const user = await User.findById(req.user._id)
        let totalPrice = 0
        user.cart.forEach(item => {
            totalPrice += item.totalPrice
        });
        const order = await Order.create({
            user : user._id,
            products : user.cart,
            totalPrice
        })
        if(!order){
            res.json({
                Status : "Failed",
                Message : "Failed to place order"
            }).status(400)
        }
        else{
            user.cart = []
            await user.save()
            res.json({
                Status : "Success",
                Message : "Order placed successfully",
                Order : order
            }).status(200)
        }
    }
    else{
        res.json({
            Status : "Failed",
            Message : "User not loggedin"
        }).status(500)
    }
})

module.exports = {registerUser, authUser, addToCart, placeOrder}