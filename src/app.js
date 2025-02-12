const express = require("express");

const {connectDB} = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) =>{

    try {

     if(req.body.skills.length > 10){
        throw new Error("Skills not alllow more than 10");
     }   
    const user = new User(req.body);
    await user.save();

    res.send("data save successfully in the DB");
        
    } catch (error) {
        res.status(404).send("Something went wrong!, " + error.message);
    }
});

app.get("/getAllUser", async (req, res)=>{
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(404).send("User not save", error.message);
    }
});

app.get("/user/:id", async (req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            res.send("user not found");
        }
        res.send(user);
    } catch (error) {
        res.status(404).send("User not save", error.message);
    }
});

app.get("/userByEmailId", async (req, res)=>{
    
    try {
        const user = await User.findOne({emailId : req.body.emailId});
        if(!user){
            res.send("user not found");
        }
        res.send(user);
    } catch (error) {
        res.status(404).send("User not save", error.message);
    }
});

//delete the records from collection.
app.delete("/user", async (req, res) =>{
    
    try {
        const user = await User.findByIdAndDelete(req.body.userId);
        if(!user){
            res.send("user not found");
        }
        res.send("User Delete successfully");
    } catch (error) {
        res.status(404).send("Something went wrong");
    }
});

//update user data
app.patch("/user/:id", async (req, res) => {
    const userID = req.params?.id;
    const data = req.body;
   try {
      
       if(data?.skills.length > 10){
        throw new Error("Skills not allow more than 10");
       }

       const ALLOW_UPDATE = ["firstName","lastName","gender", "age", "skills","about","photoUrl"];

       const isAllowUpdate = Object.keys(data).every((k)=>{
            ALLOW_UPDATE.includes(k);
       });

       if(!isAllowUpdate){
         throw new Error("update not allow");
       }


       const user = await User.findByIdAndUpdate({_id:userID}, data, {
        returnDocument: "after",
        runValidators:true
       });
       
       if(!user){
        res.status(404).send("User id not found or something went wront!");
       }
       res.status(200).send({ message: "Data updated successfully", user });
   } catch (error) {
      res.status(500).send("something went wrong" + error.message)
   }
});



connectDB()
.then(()=> {
    console.log("database connection connected");
    app.listen(7777, () => {
        console.log("Server started on port: http://localhost:7777");
    });
})
.catch(() => {
    console.error("connect can not connected");
});