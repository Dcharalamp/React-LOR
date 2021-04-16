const mongoose = require("mongoose");

//create the user Schema
const userSchema = new mongoose.Schema({ 
    email: {type: String, required:true, unique: true},
    password:{type: String, required:true, minlength: 5},
    displayName: {type: String},
    isAdmin: {type:Boolean}
    

});

module.exports = User = mongoose.model("users", userSchema);
//we export a variable User, which is a created model which will search for users in collection "users" and will be formatted by "userSchema"


