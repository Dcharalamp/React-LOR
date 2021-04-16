//needed dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { application } = require("express");
require("dotenv").config();


// set up express



const app = express();
app.use(express.json()); //middleware
app.use(cors()); //activate in case we need




const PORT = process.env.PORT || 5000; //if env variable PORT doesnt exit, we use port 5000

app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`));

//set up mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
}, (err) => {
    if (err) throw err;
    console.log("Mongo connection established!");
});

//set up routes
app.use("/users", require("./routes/userRouter"));
app.use("/ont", require("./routes/ontologyRouter"));




