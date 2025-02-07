const express = require("express");

const app = express();

/* app.use("/", (req, res, next) => {
   if (req.path === "/") {
      return res.send("This is dashboard");
   }
   next(); // Pass control to the next middleware
}); 

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


app.get("/*fly/", (req, res) => {
    res.send({name:"raju", surname:"Bhalerao"});
});

app.get("/user/:userId/:username/:rollno", (req, res) => {
    console.log(req.params);
    res.send({ name: "raju", surname: "Bhalerao" });
});
*/

app.use(
    "/user", [(req, res, next) => {
        console.log("Handling the router");
        // res.send("Send response !");
        next();
    },
    (req, res, next) => {
        console.log("Handling rounter 2");
        //res.send("Send Response 2");
        next();
    },
    (req, res, next) => {
        console.log("Handling rounter 3");
        //res.send("Send Response 3");
        next();
    }],
    (req, res, next) => {
        console.log("Handling rounter 4");
        //res.send("Send Response 4");
        next();
    },
    (req, res, next) => {
        console.log("Handling rounter 5");
        res.send("Send Response 5");
        next();
    }

);



app.listen(7777, () => {
    console.log("Server started on port: http://localhost:7777");
});
