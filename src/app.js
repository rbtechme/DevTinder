const express = require("express");

const app = express();

/* app.use("/", (req, res, next) => {
   if (req.path === "/") {
      return res.send("This is dashboard");
   }
   next(); // Pass control to the next middleware
}); */

app.get("/user",(req, res) =>{
   res.send({name:"raju", surname:"Bhalerao"});
});

app.post("/user", (req, res)=>{
    res.send("Data save in the database!");
});

app.patch("/user", (req, res)=>{
    res.send("Data udate in the database!");
});

app.delete("/user", (req, res)=>{
    res.send("Sorry, your user data is lost!");
})

app.use("/test", (req, res) => {
    res.send("This is test");
});

app.listen(7777, () => {
    console.log("Server started on port: http://localhost:7777");
});
