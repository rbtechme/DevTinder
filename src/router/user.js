const express = require("express");
const { Connection } = require("mongoose");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");

    if (!connectionRequests) {
      throw new Error("No connection requests found");
    }

    res.status(200).send({ status: true, connectionRequests });
  } catch (error) {
    const msg = error.message;
    res.status(404).send({ status: false, msg });
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
        $or: [
            { fromUserId: loggedInUser._id, status: "accepted" },
            { toUserId: loggedInUser._id, status: "accepted" },
          ],
    }).populate("fromUserId toUserId", "firstName lastName");

    const data  =  connectionRequests.map((connectionRequest) => {
        if (connectionRequest.fromUserId.equals(loggedInUser._id)) {
            return {
              userData: connectionRequest.toUserId,
              status: connectionRequest.status,
            };
          } else {
            return {
              userData: connectionRequest.fromUserId,
              status: connectionRequest.status,
            };
          }
    });

    res.status(200).send({ status: true, data });
  } catch (error) {
    const msg = error.message;
    res.status(404).send({ status: false, msg });
  }
});

module.exports = userRouter;
