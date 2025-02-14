const express = require("express");
const {connectDB} = require("./config/database");
const User = require("./models/user");
const {validateSignUpData, validateSignInData} = require("./utils/validation");
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) =>{

    try {
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        const user = new User({
            firstName, lastName, emailId, password:passwordHash
        });
        await user.save();
        res.send({status:true, message:"data save successfully in the DB", user});
        
    } catch (error) {
        const errMsg = error.message;
        res.status(500).send({status:false, errMsg});
    }
});

app.post("/login", async (req, res)=>{
    try {
        validateSignInData(req);
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credential");
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword){
            throw new Error("Invalid Credential");
        }
   
        res.status(200).send({status:true, message:"login Successful!", user});
 
    } catch (error) {
        const errMsg = error.message;
        res.status(500).send({status:false, errMsg});
    }
})

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
      
       const ALLOW_UPDATE = ["firstName","lastName","gender","age","skills"];

       const isAllowUpdate = Object.keys(data).every((k)=> ALLOW_UPDATE.includes(k));

       if(!isAllowUpdate){
         throw new Error(" Update not allow");
       }

       if(data?.skills.length > 10){
        throw new Error(" Skills not allow more than 10");
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
      res.status(500).send(" something went wrong" + error.message)
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