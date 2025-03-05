const express = require("express");
const { Connection } = require("mongoose");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

    const data = connectionRequests.map((connectionRequest) => {
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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    /* const loggedInUser = req.user;
    const allUserData = await User.find();
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id},
        { toUserId: loggedInUser._id},
      ],
    }).select("fromUserId toUserId");

    const filderUserdata = allUserData.filter((userData) => {
      if (userData._id.equals(loggedInUser._id)) {
        return false;
      }
      return !connectionRequest.find((connection) => {
        return (
          connection.fromUserId.equals(userData._id) ||
          connection.toUserId.equals(userData._id)
        );
      });
    });

    const data = filderUserdata.map((userData) => {
        return {
          "_id": userData._id,
          "firstName": userData.firstName,
          "lastName": userData.lastName,
          "gender": userData.gender,
          "photoUrl": userData.photoUrl,
          "emailId": userData.emailId,
          "age": userData.age,
        }
    } );
    res.send(data);
    */
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeeds = new Set();
    connectionRequest.forEach((connection) => {
      hideUsersFromFeeds.add(connection.fromUserId);
      hideUsersFromFeeds.add(connection.toUserId);
    });

    hideUsersFromFeeds.add(loggedInUser._id);

    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeeds) },
    }).select("firstName lastName age gender emailId about photoUrl")
    .skip(skip)
    .limit(limit);

    res.status(200).send({ status: true, users });
  } catch (error) {
    const msg = error.message;
    res.status(404).send({ status: false, msg });
  }
});

module.exports = userRouter;
