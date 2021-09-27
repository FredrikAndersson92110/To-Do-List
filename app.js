const express = require("express"); 
const bodyParser = require("body-parser"); 
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose"); 

mongoose.connect("mongodb://localhost:27017/todolistDB"); 

app.set("view engine", "ejs"); 

app.use(express.urlencoded({extended: true})); 
app.use(express.static("public")); 

// GET 
app.get("/", (req,res) => {

    const day = date.getDay(); 

    res.render("list", {listTitle: day, newListItems: items}); 
});

app.get("/work", (req, res) => {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", (req,res) => {
    res.render("about");
});

// POST 
app.post("/", (req, res) => {
    console.log(req.body);

    if (req.body.list === "Work") {
        workItems.push(req.body.newItem);
        res.redirect("/work");
    } else {
        items.push(req.body.newItem); 
        res.redirect("/"); 
    }
});





// RUN SERVER  
app.listen(3000, () => {
    console.log("Server is running on port 3000"); 
});