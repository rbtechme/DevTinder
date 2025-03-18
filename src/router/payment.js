const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constant");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

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

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("x-razorpay-signature");
    const isWebhookSignature = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if(!isWebhookSignature){
      return res.status(400).send({ status: false, errMsg: "Invalid Signature" });
    }

    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId : paymentDetails.order_id });
    if(!payment){
      return res.status(400).send({ status: false, errMsg: "Payment not found" });
    }
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findById({ _id: payment.userId });
    user.isPremiumUser = isWebhookSignature;
    user.membership = paymentDetails.notes.memberShip;
    await user.save();
    res.send({ status: true, message: "Payment successful" });

  } catch (error) {}
});

paymentRouter.get("/premium/verify", userAuth, async (req, res)=>{
  try {
      const user = await req.user;
      if(user.isPremiumUser){
          res.send({isPremiumUser:true});
      }
      res.send({isPremiumUser:false});
      
  } catch (error) {
      const errMsg = error.message;
      res.status(500).send({status:false, errMsg});
  }
});



module.exports = paymentRouter;
