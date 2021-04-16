const router = require("express").Router();
const bcrypt = require("bcryptjs"); //password hashing
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); //we need that for validation purposes
const auth = require("../middleware/auth");
//this is how backend interracts with different URLs

/**this is a HTTP GET request
//callback function whenever this function is triggered(has a request and a response)
router.get("/test", (req, res) => {
    res.send("Hello, it's working");
});
**/


//async,we'll saving stuff on mongo, so its an async operation
router.post("/register", async (req, res) => {
    try{
        let { email, password, passwordCheck, displayName, isAdmin } = req.body; //this will create 4 variables that will store whatever we write on frontend. We dont use const(for displayName purposes)

        //validate those fields

        if(!email || !password || !passwordCheck)
            return res.status(400).json({msg: "Ανεπαρκή στοιχεία."});
        if(password.length < 5)
            return res.status(400).json({msg: "Ελάχιστο μήκος κωδικού: 5"});
        if(password !== passwordCheck)
            return res.status(400).json({msg: "Οι κωδικοί δεν ταιριάζουν"});
        
        const existingUser = await User.findOne({email: email}); //(promise)we wait to  find a user with a mail that matches the mail given in frontend. If one is found, its stored in this variable. If not, the variable is null
        if(existingUser)
            return res.status(400).json({msg: "Το email υπάρχει ήδη. "});

        if(!displayName) //displayName is optional, so if some1 doesnt give one, displayName is the mail given
            displayName = email;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt); //hashing the password
        

        
        //create the new user based on User model
        const newUser = new User({
           email,
           password: passwordHash,
           displayName,
           isAdmin 
        });
        //save the new user(saving is a promise so await)
        const savedUser = await newUser.save();
        res.json(savedUser);

    } catch (err) {
       res.status(500).json({error: err.message});
    }



});

router.post("/login", async (req, res) =>{
    try{
        const {email, password} = req.body;

        //validate

        if(!email || !password)
            return res.status(400).json({msg: "Ανεπαρκή στοιχεία."});

        const user = await User.findOne({email: email});
        if(!user)
            return res.status(400).json({msg: "Tο παρόν email δεν υπάρχει."});
        
        const isMatch = await bcrypt.compare(password, user.password); //compare the input pw from frontend with the pw we got from DB with findOne
        if(!isMatch)
            return res.status(400).json({msg: "Λάθος κωδικός."});

        const token = jwt.sign({id: user._id }, process.env.JWT_SECRET);//_id is the id that mongoDB autogenerates and it's unique for every entry
        //we sign this id to the token which is the logined user
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                isAdmin: user.isAdmin
            },
        });
    } catch (err){
        res.status(500).json({error: err.message});
    }

});

//we want this to be private route, we dont want to delete all the users in DB
//we'll delete only the logined user, so we'll use some middleware 
//first will execute the middleware "auth", then what's inside the function
router.delete("/delete", auth, async(req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);

    } catch (err){
        res.status(500).json({error: err.message});
    }


});

router.post("/tokenIsValid", async (req,res) =>{

    try{
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if(!user) return res.json(false);

        return res.json(true);

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
      displayName: user.displayName,
      id: user._id,
      isAdmin: user.isAdmin

    });
});


module.exports = router;