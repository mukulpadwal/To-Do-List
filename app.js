// This part of the code contains importing all the necessary libraries that will be used in our to-do list project
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Here we are creating some empty arrays so that we can store the tasks that the user has entered in our app
var items = [];
var workItems = [];

// Here we are creating a constant named app so that we can use it to to create our backend using express
const app = express();

// Here we are telling the server that we are using ejs
app.set("view engine","ejs");

// Here we are initialising the body parser object so that we can preprocess the data that is sent through the post req
app.use(bodyParser.urlencoded({
    extended: true
}));

// Here we are telling that our server to look for all static files in the folder named public
app.use(express.static("public"));

// We are creating a get request for the home route
app.get("/", function (req, res){

    var date = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var day = date.toLocaleDateString("en-US", options);

    res.render("list",{listTitle: day, newListItems: items});
});

app.post("/", function (req, res){
    
    var item = req.body.newTask;
    if(req.body.button === "Work"){
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
})

app.get("/work", function (req, res){
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function (req, res){
    res.render("about");
})

app.listen(3000, function (){
    console.log("Server is up and running on port 3000...");
});