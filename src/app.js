const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();
require("./utils/cronjob");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", require("./router/auth"));
app.use("/", require("./router/profile"));
app.use("/", require("./router/request"));
app.use("/", require("./router/forgotPassword"));
app.use("/", require("./router/user"));
app.use("/", require("./router/payment"));

connectDB()
  .then(() => {
    console.log("database connection connected");
    app.listen(process.env.PORT, () => {
      console.log("Server started on port:7777");
    });
  })
  .catch(() => {
    console.error("MongoDB can not connect, Please try again and check internet connection is proper..");
  });
