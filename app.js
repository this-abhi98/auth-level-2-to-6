//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose = require('mongoose');

const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const userSchema = new mongoose.Schema ({               //if you use encryption you have to use proper new mongoose.schema
  email: String,                                       //proper object
  password: String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});  //if you wont include encrypted fiels  then it will  encrypt everythin inside schema
const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/submit",function(req,res){
  res.render("submit");
});

app.post("/register",function(req,res){
  const newUser = new User ({
    email : req.body.username,
    password : req.body.password
  });
  newUser.save(function(err)
{
  if(err){
    console.log(err);
  }
  else{
    res.render("secrets")
  }
});
});

app.post("/login",function(req,res){
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({email:email},function(err,found){
    if(!found){
      console.log("user not found");
    }
    else{
      if(found.password===password){
        res.render("secrets");
      }
      else{
        console.log("wrong password");
      }

    }
  });
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
