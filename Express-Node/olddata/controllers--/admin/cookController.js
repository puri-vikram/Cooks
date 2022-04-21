require("dotenv").config();
let Country = require('country-state-city').Country;
let State = require('country-state-city').State;
let City = require('country-state-city').City;
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/webAuth");
const { BASE_URL } = process.env;

const User = require("../../model/user");
const Cook = require("../../model/cook");
const Recipe = require("../../model/recipe");
const Recipetype = require("../../model/recipetype");

//cook listing
exports.list = async function(req, res) {
  var filter = {};
  if(req.query.firstname){
    var namearray = req.query.firstname.split(" ");
    var filter = {$or:[ {'firstname':{ $regex: '.*' + namearray[0] + '.*' }}, {'lastname':{ $regex: '.*' + namearray[0] + '.*' }}]};
  } else {
    var filter = {};
  }
  if(req.query.hourly_rate){
    filter['hourly_rate'] = req.query.hourly_rate;
  }
  if(req.query.email){
    filter['email'] = { $regex: '.*' + req.query.email + '.*' };
  }
  const limit =  Number(req.query.limit ? req.query.limit : 10);
  const page =  Number(req.query.page ? (req.query.page-1) : 0);
  const cooks = await Cook.find(filter, null, { skip: (page*limit), limit: limit });
  const cooksCount = await Cook.find(filter).count();

  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  return res.render('cooks.twig', {
      title : "Cooks List",
      url : "cooks",
      message : message,
      cooksCount : cooksCount,
      page : (page+1),
      limit : limit,
      totalpage : Math.ceil(cooksCount/limit),
      cooks : JSON.parse(JSON.stringify(cooks)),
      searchData : req.query,
      BASE_URL : BASE_URL,
      req : req,
  }); 
};

//cook delete
exports.delete = async function(req, res) {
  const user = await Cook.deleteOne({_id : req.params.id});
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  res.cookie("message", "Deleted Successfully", { httpOnly: true });
  //res.redirect('/cooks');
  return res.redirect('/cooks');
};

//cook edit view
exports.editView = async function(req, res) {
  const cook = await Cook.findOne({_id : req.params.id});
  const recipes = await Recipe.find({user_id : req.params.id});
  const recipetype = await Recipetype.find({});
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });

  return res.render('cookedit.twig', {
      title : "Cook Edit",
      url : "cooks",
      message : message,
      Country : Country,
      State : State,
      City : City,
      cookData : JSON.parse(JSON.stringify(cook)),
      recipetypeData : JSON.parse(JSON.stringify(recipetype)),
      recipesData : JSON.parse(JSON.stringify(recipes)),
      BASE_URL : BASE_URL,
      languages : ['english', 'spanish', 'mandarin', 'dutch'],
      specialitys : ['pudding', 'ice Cream', 'french toast'],
      dietary_preferences : ['pudding', 'ice Cream', 'french toast'],
      meal_types : ['breakfast', 'lunch', 'dinner'],
      cuisine_preferences : ['italian', 'spanish', 'french'],
      req : req,
  }); 
};

//cook add view
exports.addView = async function(req, res) {
  const cook = await new Cook();
  const recipes = await Recipe.find({user_id : req.params.id});
  const recipetype = await Recipetype.find({});
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });

  return res.render('cookadd.twig', {
      title : "Cook Edit",
      url : "cooks",
      message : message,
      Country : Country,
      State : State,
      City : City,
      cookData : JSON.parse(JSON.stringify(cook)),
      BASE_URL : BASE_URL,
      languages : ['english', 'spanish', 'mandarin', 'dutch'],
      specialitys : ['pudding', 'ice Cream', 'french toast'],
      dietary_preferences : ['pudding', 'ice Cream', 'french toast'],
      meal_types : ['breakfast', 'lunch', 'dinner'],
      cuisine_preferences : ['italian', 'spanish', 'french'],
      req : req,
  }); 
};

//cook update
exports.add = async function(req, res) {
  var { firstname, lastname, email, hourly_rate, about_me, country, state, city, zipcode, address, profession, languages, speciality, meal_type, cuisine_preference, dietary_preference, password} = req.body;
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    var message = req.cookies["message"];
    res.clearCookie("message", { httpOnly: true });
    res.cookie("message", "Email Already Exist.", { httpOnly: true });
    res.redirect('/cook/add');
  }

  const oldCook = await Cook.findOne({ email });
  if (oldCook) {
    var message = req.cookies["message"];
    res.clearCookie("message", { httpOnly: true });
    res.cookie("message", "Email Already Exist.", { httpOnly: true });
    res.redirect('/cook/add');
  }

  const CookData = await Cook.findOne({_id : req.params.id});

  if(!languages){
    languages = [];
  }
  if(!speciality){
    speciality = [];
  }
  if(!meal_type){
    meal_type = [];
  }
  if(!dietary_preference){
    dietary_preference = [];
  }
  if(!cuisine_preference){
    cuisine_preference = [];
  }
  encryptedPassword = await bcrypt.hash(password, 10);

  

  const cook = await Cook.create({
      firstname,
      lastname,
      hourly_rate,
      about_me,
      country,
      state,
      city,
      email,
      zipcode,
      address,
      profession,
      languages,
      speciality,
      meal_type,
      dietary_preference,
      cuisine_preference,
      is_verify: true,
      password: encryptedPassword,
      created_at: new Date(),
      updated_at: new Date()
    });
  const newCookData = await Cook.findOne({ _id:  cook._id});
  if(req.file){
    const recipe = await newCookData.updateOne({
       pictures: "cook/"+req.file.filename
    });
  }
  res.cookie("message", "Created Successfully", { httpOnly: true });
  return res.redirect('/cook/edit/'+cook._id);
};

//cook update
exports.update = async function(req, res) {
  var { firstname, lastname, email, hourly_rate, about_me, country, state, city, zipcode, address, profession, languages, speciality, meal_type, cuisine_preference, dietary_preference} = req.body;
  const CookData = await Cook.findOne({_id : req.params.id});

  if(!languages){
    languages = [];
  }
  if(!speciality){
    speciality = [];
  }
  if(!meal_type){
    meal_type = [];
  }
  if(!dietary_preference){
    dietary_preference = [];
  }
  if(!cuisine_preference){
    cuisine_preference = [];
  }
  if(req.file){
    const recipe = await CookData.updateOne({
       pictures: "cook/"+req.file.filename
    });
  }

  const user = await CookData.updateOne({
      firstname,
      lastname,
      hourly_rate,
      about_me,
      country,
      state,
      city,
      zipcode,
      address,
      profession,
      languages,
      speciality,
      meal_type,
      dietary_preference,
      cuisine_preference,
      updated_at: new Date()
    });
  const newCookData = await Cook.findOne({ _id:  req.params.id});
  res.cookie("message", "updated Successfully", { httpOnly: true });
  return res.redirect('/cook/edit/'+req.params.id);
};

//cook recipe update
exports.RecipeUpdate = async function(req, res) {
  const { title, description, diet_type, images } = req.body;
  var imagesData = [];
  if(images){
    imagesData = images.split(',');
  }

  const RecipesData = await Recipe.findOne({_id : req.params.id});

  const user = await RecipesData.updateOne({
      title,
      diet_type,
      description,
      images: imagesData
    });
  res.cookie("message", "updated Successfully", { httpOnly: true });
  return res.redirect('/cook/edit/'+RecipesData.user_id);
};

//cook recipe delete
exports.RecipeDelete = async function(req, res) {
  const RecipesData = await Recipe.findOne({_id : req.params.id});
  RecipesData.deleteOne();
  res.cookie("message", "Deleted Successfully", { httpOnly: true });
  return res.redirect('/cook/edit/'+RecipesData.user_id);
};


//user edit
exports.passwordUpdate = async function(req, res) {
  const { password} = req.body;
  encryptedPassword = await bcrypt.hash(password, 10);
  const UserData = await Cook.findOne({_id : req.params.id});

  const user = await UserData.updateOne({
      password: encryptedPassword,
    });
  const newUserData = await Cook.findOne({ _id:  req.params.id});
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  res.cookie("message", "updated Successfully", { httpOnly: true });
  return res.redirect('/user/edit/'+req.params.id);
  
};