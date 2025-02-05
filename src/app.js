const express = require("express");

const app = express();

app.use("/", (req, res, next) => {
   if (req.path === "/") {
      return res.send("This is dashboard");
   }
   next(); // Pass control to the next middleware
});

app.use("/test", (req, res) => {
    res.send("This is test");
});

app.listen(7777, () => {
    console.log("Server started on port: http://localhost:7777");
});
