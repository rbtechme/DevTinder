const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: 
    { 
        type : String,
        minLength:3,
        required: true

    },
    lastName: 
    { type : String

    },
    gender: 
    { 
        type : String,
         validate(value){
            if(!["Male","Female", "Other"].includes(value)){
                throw new Error("Gender data not valid");
            }
         },
         
    },
    emailId: 
    { 
        type : String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email address not valid, Please put correct email address")
            }
         },

    },
    password: 
    { 
        type : String

    },
    age: 
    { 
        type : Number,
        min:18
    },
    about:{
        type: String,
        default:"This is default text insertion example"
    },
    photoUrl:{
        type: String,
        default:"https://i.pravatar.cc/300"
    },
    skills:
    {
        type:[String]
    },
    isPremiumUser:{
        type: Boolean,
        default:false
    },
    membership:{
        type: String
    },
},{
    timestamps:true
});




userSchema.methods.getJWT = async function () {
    const user =  this;
    const token  = await jwt.sign({_id:user._id}, "@#@@rAjUbHaLeRaO53443#@@#",{ 
        expiresIn: '7day' 
    } );
    return token;            
}

userSchema.methods.validatePassword = async function (passwordByUserInput) {
    const user = this;
    const passwordHash = user.password;

    const varifyPassword = await bcrypt.compare(passwordByUserInput, passwordHash);

    return varifyPassword;
    
}

module.exports = mongoose.model("User", userSchema);

