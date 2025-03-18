const express = require('express');
const {userAuth} = require("../middlewares/auth");
const {validateProfileEditData} = require("../utils/validation");
const payment = require('../models/payment');
const paymentRouter = require('./payment');

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res)=>{
    try {
        const user = await req.user;
        res.send({status:true, message:"User all data", user});
        
    } catch (error) {
        const errMsg = error.message;
        res.status(500).send({status:false, errMsg});
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
    try {
        if(!validateProfileEditData(req)){
            throw new Error("Edit profile data not valid");
        }
        const profileEditData = await req.user;
        Object.keys(req.body).forEach((update)=> profileEditData[update] = req.body[update]); //
        await profileEditData.save();
        res.send({status:true, message:"Profile data updated successfully", profileEditData});

        
    } catch (error) {
        const err = error.message;
        res.status(500).send({status:false, err});
    }
});



module.exports = profileRouter;