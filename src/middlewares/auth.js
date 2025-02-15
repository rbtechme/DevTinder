const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) =>{
    try {
    const {token} = req.cookies;
    if(!token){
        throw new Error("Token not valid.");
    }
    const {_id} = await jwt.verify(token, "@#@@rAjUbHaLeRaO53443#@@#");
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not exits");
    }
    req.user = user;
    next();
    } catch (error) {
     res.status(400).send({Error : error.message});
    }
}

module.exports = {userAuth}