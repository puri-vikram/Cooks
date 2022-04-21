require("dotenv").config();
let Country = require('country-state-city').Country;
let State = require('country-state-city').State;
let City = require('country-state-city').City;
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/webAuth");

const User = require("../../model/user");
const Cook = require("../../model/cook");
const Recipe = require("../../model/recipe");
const Recipetype = require("../../model/recipetype");
const { BASE_URL } = process.env;

//users listing
exports.listView = async function(req, res) {
  if(req.query.name){
  var namearray = req.query.name.split(" ");
  var filter = {$or:[ {'firstname':{ $regex: '.*' + namearray[0] + '.*' }}, {'lastname':{ $regex: '.*' + namearray[0] + '.*' }}]};
   // filter['firstname'] = { $regex: '.*' + req.query.name + '.*' };
    //filter['$or'] = { $regex: '.*' + req.query.name + '.*' };
    //filter['lastname'] = { $regex: '.*' + req.query.name + '.*' };
  } else {
    var filter = {};
  }
  if(req.query.email){
    filter['email'] = { $regex: '.*' + req.query.email + '.*' };
  }
  if(req.query.is_admin){
    filter['is_admin'] = req.query.is_admin;
  }
  console.log(filter);

  const limit =  Number(req.query.limit ? req.query.limit : 10);
  const page =  Number(req.query.page ? (req.query.page-1) : 0);
  const users = await User.find(filter, null, { skip: (page*limit), limit: limit });
  const usersCount = await User.find(filter).count();

  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  res.render('users.twig', {
      title : "Users List",
      url : "users",
      message : message,
      usersCount : usersCount,
      page : (page+1),
      limit : limit,
      totalpage : Math.ceil(usersCount/limit),
      users : JSON.parse(JSON.stringify(users)),
      searchData : req.query,
      BASE_URL : BASE_URL,
      req : req,
  }); 
};

//user delete
exports.delete = async function(req, res) {
  const user = await User.deleteOne({_id : req.params.id});

  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  res.cookie("message", "Deleted Successfully", { httpOnly: true });
  return res.redirect('/users');

  // res.cookie("message", "Deleted Successfully", { httpOnly: true });
  // res.redirect('/users');
};

//user edit view
exports.editView = async function(req, res) {
  const user = await User.findOne({_id : req.params.id});
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  res.render('useredit.twig', {
      title : "User Edit",
      url : "users",
      Country : Country,
      State : State,
      City : City,
      message : message,
      userData : JSON.parse(JSON.stringify(user)),
      BASE_URL : BASE_URL,
      req : req,
  }); 
};

//user add view
exports.addView = async function(req, res) {
  const user = await User();
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  res.render('useradd.twig', {
      title : "User Add",
      url : "users",
      Country : Country,
      State : State,
      City : City,
      message : message,
      userData : JSON.parse(JSON.stringify(user)),
      BASE_URL : BASE_URL,
      req : req,
  }); 
};


//user edit
exports.add = async function(req, res) {
  const { firstname, lastname, email, about_me, country, state, city, zipcode, address, is_admin, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    var message = req.cookies["message"];
    res.clearCookie("message", { httpOnly: true });
    res.cookie("message", "Email Already Exist.", { httpOnly: true });
    res.redirect('/user/add');
  }

  const oldCook = await Cook.findOne({ email });
  if (oldCook) {
    var message = req.cookies["message"];
    res.clearCookie("message", { httpOnly: true });
    res.cookie("message", "Email Already Exist.", { httpOnly: true });
    res.redirect('/user/add');
  }

  
  encryptedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
      firstname,
      lastname,
      email,
      created_at: new Date(),
      updated_at: new Date(),
      is_verify: true,
      password: encryptedPassword,
      about_me, country, state, city, zipcode, address, 
      is_admin:(is_admin === 'true')?1:0
    });
  const newUserData = await User.findOne({ _id:  user._id});
  if(req.file){
    const recipe = await newUserData.updateOne({
       pictures: "user/"+req.file.filename
    });
  }
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  res.cookie("message", "created Successfully", { httpOnly: true });
  res.redirect('/user/edit/'+user._id);
  
};


//user edit
exports.edit = async function(req, res) {
  const { firstname, lastname, email, about_me, country, state, city, zipcode, address, is_admin } = req.body;
  const UserData = await User.findOne({_id : req.params.id});

  // console.log(req.file);
  if(req.file){
    const recipe = await UserData.updateOne({
       pictures: "user/"+req.file.filename
    });
  }

  const user = await UserData.updateOne({
      firstname,
      lastname,
      updated_at: new Date(),
      about_me, country, state, city, zipcode, address, 
      is_admin:(is_admin === 'true')?1:0
    });

  const newUserData = await User.findOne({ _id:  req.params.id});
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  res.cookie("message", "updated Successfully", { httpOnly: true });
  res.redirect('/user/edit/'+req.params.id);
  
};


//user edit
exports.passwordUpdate = async function(req, res) {
  const { password} = req.body;
  encryptedPassword = await bcrypt.hash(password, 10);
  const UserData = await User.findOne({_id : req.params.id});

  const user = await UserData.updateOne({
      password: encryptedPassword,
    });
  const newUserData = await User.findOne({ _id:  req.params.id});
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  res.cookie("message", "updated Successfully", { httpOnly: true });
  res.redirect('/user/edit/'+req.params.id);
  
};