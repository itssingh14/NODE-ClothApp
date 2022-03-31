const express = require('express')
const { getProducts, getAProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const multer = require('multer')
const protect = require('../middleware/authMiddleware')

const productRouter = express.Router()
const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, './productUploads')
    },
    filename : (req, file, cb)=>{
        cb(null, Date.now() + "--" + file.originalname)
    }
})
const upload = multer({storage : storage})

productRouter.get('/products', getProducts)
productRouter.get('/product/:productId', protect, getAProduct)
productRouter.post('/add-product', protect, upload.single("productImage"), addProduct)
productRouter.put('/update-product/:productId', upload.single("productImage"), protect, updateProduct)
productRouter.delete('/delete-product/:productId', protect, deleteProduct)

module.exports = productRouter