const express = require("express"); 
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose"); 

const app = express(); 

app.set("view engine", "ejs"); 
app.use(express.urlencoded({extended: true})); 
app.use(express.static("public")); 

// DB 
mongoose.connect("mongodb://localhost:27017/todolistDB"); 

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema); 

const item1 = new Item({
    name: "make coffe"
});

const item2 = new Item({
    name: "Buy milk"
}); 

const item3 = new Item({
    name: "Bake cookies"
});

const defaultItems = [item1, item2, item3]; 



// GET 
app.get("/", (req,res) => {

    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Succesfully added our 3 default items");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems}); 
        }
    }); 
});


app.get("/work", (req, res) => {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", (req,res) => {
    res.render("about");
});

// POST SAVE ITEM TO 
app.post("/", (req, res) => {

    const itemName = req.body.newItem; 

    const item = new Item({
        name: itemName
    });

    Item.create(item);
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const itemId = req.body.checkbox; 

    Item.deleteOners({_id: itemId}, (err) => {
        if (!err) {
            res.redirect("/");
        }
    }); 

});



// RUN SERVER  
app.listen(3000, () => {
    console.log("Server is running on port 3000"); 
});