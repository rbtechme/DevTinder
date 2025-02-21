const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.ObjectId, required: true, index: true },
    toUserId: { type: mongoose.Schema.ObjectId, required: true, index: true },
    status: {
      type: String,
      required: true,
      enum: {
        values : ["interested", "ignore", "accepted", "rejected"],
        message: "{VALUES} is incorrect status type" 
      }
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
connectionRequestSchema.index({ fromUserId: 1, status: 1 }); // for filtering requests
connectionRequestSchema.index({ toUserId: 1, status: 1 }); // for filtering requests


connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection Request to yourself");
    }
    next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
