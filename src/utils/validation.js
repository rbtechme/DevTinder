const validator = require('validator');

const validateSignUpData = (req) =>{
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("firstName or lastName not put properly");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter the strong password");
    }
};

const validateSignInData = (req)=>{
    const {emailId} = req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("Please add correct Email ID");
    }
}

module.exports  = {
    validateSignUpData,
    validateSignInData,
}
