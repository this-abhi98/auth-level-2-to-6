//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User ({
      email : req.body.username,
      password : hash                   //apply md5 fuction to store as a hash funtion
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


});

app.post("/login",function(req,res){
  const email = req.body.username;
  const password = req.body.password;                   //then again apply md5 hash fuction then compare password
  User.findOne({email:email},function(err,found){
    if(!found){
      console.log("user not found");
    }
    else{
      bcrypt.compare(password, found.password, function(err, result) {
    // result == true
    if(result){
      res.render("secrets");
    }
});
  }
  });
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
