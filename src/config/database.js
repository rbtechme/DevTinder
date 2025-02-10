const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://techcarecode_mongodb:5vA5KkzNkYbMYC1o@cluster0.fj5cq.mongodb.net/");
};

module.exports = {connectDB}
