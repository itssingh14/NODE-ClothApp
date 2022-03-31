const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const fs = require('fs')
const imagePath = "./productUploads/"

//Route : /shop/products
const getProducts = asyncHandler(async(req, res)=>{
    try {
        const products = await Product.find()
        res.json(products).status(200)
    } catch (error) {
        res.json({
            Status : "Failed",
            Message : "Failed to load products",
            Error : error
        }).status(500)
    }
})

//Route : /shop/product/:productId
const getAProduct = asyncHandler(async(req, res)=>{
    const productId = req.params.productId
    if(req.user !== null){
        try {
            const product = await Product.findById(productId)
            res.json(product).status(200)
        } catch (error) {
            res.json({
                Status : "Failed",
                Message : "Failed to load product",
                Error : error
            }).status(500)
        }
    }
    else{
        res.json({
            Status : "Failed",
            Message : "Not Authorized"
        }).status(400)
    }
})

//Route : /shop/add-product
const addProduct = asyncHandler(async(req, res)=>{
    const productImage = req.file.filename
    if(req.user !== null && req.user.isAdmin){
        const {name, description, price, productCode, inStock} = req.body
        if(!name || !description || !price || !productImage || !productCode){
            res.json({
                Status : "Failed",
                Message : "Enter product details"
            }).status(400)
            fs.unlink(imagePath+productImage, err=>{
                if(err){
                    console.log(err)
                    return
                }
            })
            return
        }
        const productExists = await Product.findOne({productCode})
        if(productExists){
            res.json({
                Status : "Failed",
                Message : "Product already exists"
            }).status(400)
            fs.unlink(imagePath+productImage, err=>{
                if(err){
                    console.log(err)
                    return
                }
            })
        }
        else{
            const product = await Product.create({
                name,
                description,
                price,
                productImage,
                productCode,
                inStock
            })
            if(!product){
                res.json({
                    Status : "Failed",
                    Message : "Product adding failed"
                }).status(400)
                fs.unlink(imagePath+productImage, err=>{
                    if(err){
                        console.log(err)
                        return
                    }
                })
            }
            else{
                res.json({
                    id : product._id,
                    name : product.name,
                    description : product.description,
                    price : product.price,
                    productImage : product.productImage,
                    productCode : product.productCode,
                    inStock : product.inStock
                }).status(200)
            }
        }
    }
    else{
        res.json({
            Status : "Failed",
            Message : "Not Authorized"
        }).status(400)
        fs.unlink(imagePath+productImage, err=>{
            if(err){
                console.log(err)
                return
            }
        })
    }
})

//Route : /shop/update-product/:productId
const updateProduct = asyncHandler(async(req, res)=>{
    const productImage = req.file.filename
    if(req.user !== null && req.user.isAdmin){
        const {name, description, price, productCode, inStock} = req.body
        if(!name || !description || !price || !productImage || !productCode){
            res.json({
                Status : "Failed",
                Message : "Enter product details"
            }).status(400)
            fs.unlink(imagePath+productImage, err=>{
                if(err){
                    console.log(err)
                    return
                }
            })
            return
        }
        const product = await Product.findById(req.params.productId)
        if(!product){
            res.json({
                Status : "Failed",
                Message : "Product not found"
            }).status(400)
            fs.unlink(imagePath+productImage, err=>{
                if(err){
                    console.log(err)
                    return
                }
            })
        }
        else{
            const oldImage = product.productImage
            product.name = name
            product.description = description
            product.price = price
            product.productImage = productImage
            product.productCode = productCode
            product.inStock = inStock
            const saveProduct = await product.save()
            if(!saveProduct){
                res.json({
                    Status : "Failed",
                    Message : "Product update failed"
                }).status(500)
                fs.unlink(imagePath+productImage, err=>{
                    if(err){
                        console.log(err)
                        return
                    }
                })
            }
            else{
                res.json({
                    Status : "Success",
                    Message : "Updated successfully" 
                }).status(200)
                fs.unlink(imagePath+oldImage, err=>{
                    if(err){
                        console.log(err)
                        return
                    }
                })
            }
        }
    }
    else{
        res.json({
            Status : "Failed",
            Message : "Not Authorized"
        }).status(400)
        fs.unlink(imagePath+productImage, err=>{
            if(err){
                console.log(err)
                return
            }
        })
    }
})

//Route : /shop/delete-product/:productId
const deleteProduct = asyncHandler(async(req, res)=>{
    if(req.user !== null && req.user.isAdmin){
        const product = await Product.findById(req.params.productId)
        if(!product){
            res.json({
                Status : "Failed",
                Message : "Product not found"
            }).status(400)
        }
        else{
            const deleteImage = product.productImage
            const removedProduct = await product.remove()
            if(!removedProduct){
                res.json({
                    Status : "Failed",
                    Message : "Product delete failed"
                }).status(500)
            }
            else{
                fs.unlink(imagePath+deleteImage, err=>{
                    if(err){
                        console.log(err)
                        return
                    }
                })
                res.json({
                    Status : "Success",
                    Message : "Deleted successfully" 
                }).status(200)
            }
        }
    }
    else{
        res.json({
            Status : "Failed",
            Message : "Not Authorized"
        }).status(400)
    }
})

module.exports = {getProducts, getAProduct, addProduct, updateProduct, deleteProduct}