const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://techcarecode_mongodb:eid30LWHtxjmJGwH@cluster0.fj5cq.mongodb.net/DevTinder"
  );
};

module.exports = { connectDB };
