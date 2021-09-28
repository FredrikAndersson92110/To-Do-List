const express = require("express"); 
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose"); 
const _ = require("lodash");

const app = express(); 

app.set("view engine", "ejs"); 
app.use(express.urlencoded({extended: true})); 
app.use(express.static("public")); 

// DB 
mongoose.connect("mongodb+srv://fredrik-andersson:mongodb-password@cluster0.2ozuf.mongodb.net/todolistDB"); 

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema); 

const item1 = new Item({
    name: "New to do list!"
});

const item2 = new Item({
    name: "Add new item +"
}); 

const item3 = new Item({
    name: "<-- delete item"
});

const defaultItems = [item1, item2, item3]; 

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

// GET READ
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

app.get("/list/:customList", (req, res) => {
    const customList = _.capitalize(req.params.customList);

    List.findOne({name: customList}, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customList,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customList);
            } else {
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});    
            }
        } else {
            console.log(err);
        }
    });
});


// POST SAVE ITEM TO 
app.post("/", (req, res) => {
    const itemName = req.body.newItem; 
    const listName = req.body.list; 

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        Item.create(item);
        res.redirect("/");
    } else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(item); 
            foundList.save(); 
            res.redirect("/" + listName);
        });
    }
});


// DELETE ITEM 
app.post("/delete", (req, res) => {
    const itemId = req.body.checkbox; 
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.deleteOne({_id: itemId}, (err) => {
            if (!err) {
                res.redirect("/");
            }
        });    
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}}, (err, foudList) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    } 
});



// RUN SERVER  
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

app.listen(port, () => {
    console.log("Server has started succesfully"); 
});