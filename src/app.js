const express = require("express");
const {connectDB} = require("./config/database");
const User = require("./models/user");
const {validateSignUpData, validateSignInData} = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

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
        const isPassword = await user.validatePassword(password);
        if(!isPassword){
            throw new Error("Invalid Credential");
        }else{
            const token = await user.getJWT();

            console.log(token);

            res.cookie('token',token);

            res.status(200).send({status:true, message:"login Successful!"});
        }
   
 
    } catch (error) {
        const errMsg = error.message;
        res.status(500).send({status:false, errMsg});
    }
});

app.get("/profile", userAuth, async (req, res)=>{
    try {
        const user = await req.user;
        res.send({status:true, message:"User all data", user});
        
    } catch (error) {
        const errMsg = error.message;
        res.status(500).send({status:false, errMsg});
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res)=>{
    console.log("sending the request");
    const user = req.user;
    
    res.send(user.firstName + " send request connection");
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