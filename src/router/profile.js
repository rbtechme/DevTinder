const express = require('express');
const {userAuth} = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res)=>{
    try {
        const user = await req.user;
        res.send({status:true, message:"User all data", user});
        
    } catch (error) {
        const errMsg = error.message;
        res.status(500).send({status:false, errMsg});
    }
})

module.exports = profileRouter;