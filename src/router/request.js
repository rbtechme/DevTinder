const express = require("express");
const {userAuth} = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res)=>{
    console.log("sending the request");
    const user = req.user;
    
    res.send(user.firstName + " send request connection");
});

module.exports = requestRouter;