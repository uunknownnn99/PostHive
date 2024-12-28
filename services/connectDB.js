const mongoose = require("mongoose");

const uri = "mongodb+srv://PostHive:PostHiveDev@data.5veo4.mongodb.net/PostHive?retryWrites=true&w=majority&appName=data";
function connect(){
    mongoose
    .connect(uri)
    .then(() => {
        console.log("DataBase Connected");
    })
    .catch((err) => {
        console.log("Error");
    });
}
module.exports = connect;