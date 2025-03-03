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
    
    if(!validator.isEmail(emailId) || !emailId){
        throw new Error("Please add correct Email ID");
    }
  
}

const validateProfileEditData = (req)=>{
    try {
        const allowedUpdates = ['firstName', 'lastName', 'emailId', 'age', 'about', 'photoUrl', 'skills'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));
        return isValidOperation;
    } catch (error) {
        
    }
    
  
   
}

module.exports  = {
    validateSignUpData,
    validateSignInData,
    validateProfileEditData
}
