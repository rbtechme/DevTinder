const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) =>{
    try {
    const {token} = req.cookies;
    if(!token){
       return res.status(401).send({Error : "Please login first"});
    }
    const {_id} = await jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not exits");
    }
    req.user = user;
    next();
    } catch (error) {
     res.status(401).send({Error : error.message});
    }
}

module.exports = {userAuth}