const jwt = require("jsonwebtoken");

//we need an error function to authenticate the jwt
//we have 3 parameters cuz after the result we wanna specify what the function will do NEXT
const auth = (req, res, next) => {
    try{
        const token = req.header("x-auth-token");//this is the token generated when u log in and is in frontend
        if(!token)
            return res.status(401), json({msg: "no auth token"}); 
       
        const verified = jwt.verify(token, process.env.JWT_SECRET);//this gives the decoded jwt
        if(!verified)
            return res.status(401).json({msg: "Token verification failed"});

        req.user = verified.id; //we take .id cuz if we take all verified it returns irrelevant stuff we dont want
        next();
    } catch (err){
        res.status(500).json({error: err.message});
    }
};


module.exports = auth;