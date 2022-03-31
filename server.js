const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const analyticRouter = require('./routes/analyticsRoutes')
const orderRouter = require('./routes/orderRoutes')

const app = express()
app.use(express.json())
dotenv.config()
connectDB()

app.use('/user', userRouter)
app.use('/shop', productRouter)
app.use('/analytics', analyticRouter)
app.use('/orders', orderRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Server started at ${PORT}`)
})