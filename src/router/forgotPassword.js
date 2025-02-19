const express =  require('express');
const bcrpyt = require('bcrypt');
const User = require('../models/user');

const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post("/forgotPassword", async (req, res)=>{
    try {
        
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if(password !== confirmPassword){
            throw new Error("Password and Confirm Password not match");
        }
        const passwordHash = await bcrpyt.hash(password, 10);
        const user = await User.findOne({emailId:req.body.emailId});
        if(!user){
            throw new Error("User not found");  
        }

        user.password = passwordHash;
        user.save();

        res.send({status:true, message:"Password changed successfully", passwordHash});
        
    } catch (error) {
        res.status(500).send({status:false, errMsg:error.message});
    }
});

module.exports = forgotPasswordRouter;