const mongoose = require("mongoose");
const validator = require('validator');

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
        default:"https://picsum.photos/id/237/200/300"
    },
    skills:
    {
        type:[String]
    }
},{
    timestamps:true
});

module.exports = mongoose.model("User", userSchema);

