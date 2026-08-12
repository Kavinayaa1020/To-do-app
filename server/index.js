const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");

const app=express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Todo API is running");
});

//connect mongodb
mongoose.connect("mongodb://localhost:27017/todoapp")
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.error("MongoDB connection error:",err);
});

//create schema
const todoSchema=new mongoose.Schema({
    title:String,
    description:String
});

//create model
const Todo=mongoose.model("Todo",todoSchema);

//create new todo item
app.post("/todos",async(req,res)=>{
    const {title,description}=req.body;

    try{
        const newTodo=new Todo({
            title,
            description
        });

        const savedTodo=await newTodo.save();

        res.status(201).json(savedTodo);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Error saving todo"});
    }
});

//get all todo items
app.get("/todos",async(req,res)=>{
    try{
        const todos=await Todo.find();
        res.json(todos);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Error fetching todos"});
    }
});

//update todo item
app.put("/todos/:id",async(req,res)=>{
    const {title,description}=req.body;

    try{
        const updatedTodo=await Todo.findByIdAndUpdate(
            req.params.id,
            {title,description},
            {returnDocument:"after"}
        );

        res.json(updatedTodo);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Error updating todo"});
    }
});

//delete todo item
app.delete("/todos/:id",async(req,res)=>{
    try{
        const deletedTodo=await Todo.findByIdAndDelete(req.params.id);

        res.json(deletedTodo);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Error deleting todo"});
    }
});

//start server
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});