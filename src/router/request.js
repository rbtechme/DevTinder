const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User  = require('../models/user');
const { Connection } = require("mongoose");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { toUserId, status } = req.params;
    const { _id: fromUserId, firstName: fromUserFirstName } = req.user;

    // Prevent sending a request to oneself
    if (fromUserId === toUserId) {
      throw new Error("You can't send request to yourself");
    }

    // Check if a connection request already exists
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingRequest) {
      throw new Error("Request already sent");
    }

    // Create and save a new connection request
    const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });
    await connectionRequest.save();

    // Retrieve the recipient user information
    const toUser = await User.findById(toUserId);
    const toUserFirstName = toUser.firstName;

    // Send response based on the status
    const message = status === "interested" 
      ? `${fromUserFirstName} sent interest in ${toUserFirstName}` 
      : `${fromUserFirstName} ignored ${toUserFirstName}`;

    res.status(200).send({ status: true, message });

  } catch (error) {
    res.status(404).send({ status: false, message: error.message });
  }
});

requestRouter.post("/sendConnectionReview/:status/:requestedId", userAuth, async (req, res)=>{
  try {
    // requestedId means connectionRequst Collection Id that _id
    const {status, requestedId} = req.params;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status");
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestedId,
      status: "interested",
      toUserId: req.user._id
    });

    if (!connectionRequest) {
      throw new Error("Invalid request");
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    res.status(200).send({ status: true, message: "Request "+status+" successfully" });

    
  } catch (error) {
    res.status(404).send({ status: false, message: error.message });
  }
})

module.exports = requestRouter;