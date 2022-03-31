const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
    {
        name : {type : String, required : true},
        email : {type : String, required : true, unique : true},
        password : {type : String, required : true},
        userImage : {type : String, required : false},
        cart : [
            {
                productId : {type : mongoose.Schema.Types.ObjectId, required : true, ref : "Products"},
                productName : {type : String, required : true},
                productPrice : {type : Number, required : true},
                quantity : {type : Number, required : true},
                totalPrice : {type : Number, required : true} 
            }
        ],
        isAdmin : {type : Boolean , required : false, default : false}
    },
    {timestamps : true}
)

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("Users", userSchema)

module.exports = User