const adminAuth = (req, res, next) =>{
    const token = "xyz";

    const AutherizeKey = token === "xyz";
    if(!AutherizeKey){
        res.status(401).send("unauthorize user");
    }else{
        next();
    }
} 

const userAuth = (req, res, next) =>{
    const token = "xyz";

    const AutherizeKey = token === "xyz";
    if(!AutherizeKey){
        res.status(401).send("unauthorize user");
    }else{
        next();
    }
}

module.exports = {adminAuth, userAuth}