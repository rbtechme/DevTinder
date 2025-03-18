const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderId: {
            type: String,
            required: true,
        },
        paymentid: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        entity: {
            type: String,
        },
        notes:{
            firstName: {
                type: String,
            },
            lastName:{
                type: String,
            },
            emailId:{
                type: String,
            },
            membership:{
                type:String,
            }
           
        },
        status: {
            type: String,
            required: true,
        },

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
