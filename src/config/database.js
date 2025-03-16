const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    process.env.CONNECTION_KEY
  );
};

module.exports = { connectDB };
