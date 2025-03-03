const express = require("express");
const User = require("../models/user");
const {
  validateSignUpData,
  validateSignInData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send({
      status: true,
      message: "data save successfully in the DB",
      user,
    });
  } catch (error) {
    const errMsg = error.message;
    res.status(500).send({ status: false, errMsg });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateSignInData(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credential");
    }
    const isPassword = await user.validatePassword(password);
    if (!isPassword) {
      throw new Error("Invalid Credential");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), //1 hour
      });
      res.status(200).send({ status: true, data: user });
    }
  } catch (error) {
    const errMsg = error.message;
    res.status(500).send({ status: false, errMsg });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send({ status: true, message: "logout successfully!" });
});
module.exports = authRouter;
