// This part of the code contains importing all the necessary libraries that will be used in our to-do list project
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// Here we are creating a connection to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

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

// Here we are creating a schema
const itemsSchema = new mongoose.Schema({
    name: String
});

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

// Here we are creating a model
const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

// Creating the initial few entries
const item1 = new Item({name: "Welcome to the To Do List app"});
const item2 = new Item({name: "Hit on the + button to add a new task"});
const item3 = new Item({name: "<-- Hit this to delete an item"});

const defaultItems = [item1, item2, item3];


// We are creating a get request for the home route
app.get("/", function (req, res){

    var date = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var day = date.toLocaleDateString("en-US", options);

    Item.find({}, function (err, items){

        if(items.length === 0){
            Item.insertMany(defaultItems, function (err){
                if (err){
                    console.log(err);
                } else {
                    console.log("Successfully added the default items into the database.");
                }
            });
            
            res.redirect("/");
        } else {
            res.render("list",{listTitle: day, newListItems: items});
        }
    });

    
});

app.get("/:customListName", function (req, res){
    const customListName = req.params.customListName;

    List.find({}, function (err, lists){
        if(lists[0].name === customListName){
            res.render("list",{listTitle: lists[0].name, newListItems: lists[0].items});
        } else {
            res.render("list",{listTitle: lists[0].name, newListItems: lists[0].items});
        }
    });


});

app.post("/", function (req, res){
    
    const itemName = req.body.newTask;

    const item = new Item({name:itemName});

    item.save();

    res.redirect("/");

})



app.get("/about", function (req, res){
    res.render("about");
})

app.post("/delete", function (req, res){
    const id = req.body.checkedItem;

    Item.findByIdAndRemove(id , function (err){
        if(err){
            console.log(err);
        } else {
            console.log("Successfully deleted the item.");
        }
    });

    res.redirect("/");

});

app.listen(process.env.PORT || 3000, function (){
    console.log("Server is up and running on port 3000...");
});