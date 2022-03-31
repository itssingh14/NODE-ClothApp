const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = async(req, res, next)=>{
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            const token = req.headers.authorization.split(" ")[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decode.id)
            next()
        } catch (error) {
            res.json({
                Status : "Failed",
                Message : "Token verification failed",
                Error : error
            }).status(500)
        }
    }
    else{
        res.json({
            Status : "Failed",
            Message : "Token not found"
        }).status(400)
    }
}

module.exports = protect