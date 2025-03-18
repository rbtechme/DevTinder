const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constant");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { memberShip } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[memberShip] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        memberShip: memberShip,
      },
    });
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      entity: order.entity,
      status: order.status,
      notes: order.notes,
    });
    const savePayment = await payment.save();
    res.send({ ...savePayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    const errMsg = error.message;
    res.status(500).send({ status: false, errMsg });
  }
});

module.exports = paymentRouter;
