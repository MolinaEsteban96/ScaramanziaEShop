const Express = require("express");
const path = require("path");
const sequelize = require("sequelize");

const app = Express();

app.use(Express.static(__dirname + '/public'));

app.get("/" , (req, res) => {

    res.sendFile(path.join(__dirname + "/views/index.html"))
})



app.listen(3000, ()=>{

    console.log("Listening on Port 3000")
})