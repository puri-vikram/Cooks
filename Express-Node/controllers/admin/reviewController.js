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
const Review = require("../../model/review");

var mongoose = require('mongoose');

//cook listing
exports.list = async function(req, res) {
  var filter = {};
  if(req.query.title){
    filter['title'] = { $regex: '.*' + req.query.title + '.*' };
  }
  if(req.query.ratedata){
    filter['rate'] = { $gte : req.query.ratedata}
  }
  if(req.query.from){
    var namearray = req.query.from.split(" ");
    if(namearray.length >= 2){
      var filterdata = {'firstname':{ $regex: namearray[0] }, 'lastname':{ $regex: namearray[1] }};
    } else {
      //var filterdata = {'firstname':{ $regex: namearray[0] }};
      var filterdata = {$or:[ {'firstname':{ $regex: '.*' + namearray[0] + '.*' }}, {'lastname':{ $regex: '.*' + namearray[0] + '.*' }}]};

    }
    console.log(filterdata);
    const usersData = await User.find(filterdata).lean().exec();
    var userIds = usersData.map(data => { return data._id; });
    filter['user_id'] = {$in: userIds};
  }
  if(req.query.to){
    var namearray = req.query.to.split(" ");
    if(namearray.length >= 2){
      var filterdata = {'firstname':{ $regex: namearray[0] }, 'lastname':{ $regex: namearray[1] }};
    } else {
      //var filterdata = {'firstname':{ $regex: namearray[0] }};
      var filterdata = {$or:[ {'firstname':{ $regex: '.*' + namearray[0] + '.*' }}, {'lastname':{ $regex: '.*' + namearray[0] + '.*' }}]};

    }
    console.log(filterdata);
    const usersData = await Cook.find(filterdata).lean().exec();
    var userIds = usersData.map(data => { return data._id; });
    filter['cook_id'] = {$in: userIds};
  }
  const limit =  Number(req.query.limit ? req.query.limit : 10);
  const page =  Number(req.query.page ? (req.query.page-1) : 0);
  const reviews = await Review.find(filter, null, { skip: (page*limit), limit: limit, sort:{created_at: 'DESC' } })
                              .populate('user')
                              .populate('cook')
                              .lean().exec();
  const reviewsCount = await Review.find(filter).count();
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  return res.render('reviews.twig', {
      title : "Reviews List",
      url : "reviews",
      message : message,
      reviewsCount : reviewsCount,
      page : (page+1),
      limit : limit,
      totalpage : Math.ceil(reviewsCount/limit),
      reviews : JSON.parse(JSON.stringify(reviews)),
      searchData : req.query,
      BASE_URL : BASE_URL,
      req : req,
  }); 
};

//cook delete
exports.delete = async function(req, res) {
  const reviewData = await Review.findOne({_id : req.params.id});
  const deleteReview = await Review.deleteOne({_id : req.params.id}); 

  const cookData = await Cook.findOne({_id : reviewData.cook_id});
  if(cookData){
    const average = await Review.aggregate([
      { $match: { cook_id: new mongoose.Types.ObjectId(reviewData.cook_id) } },
      { $group: { _id: reviewData.cook_id, 
        rating: { $avg: '$rate' }, 
        communication: { $avg: '$communication' }, 
        presentation: { $avg: '$presentation' }, 
        taste: { $avg: '$taste' }, 
        punctuality: { $avg: '$punctuality' }, 
        cleanliness: { $avg: '$cleanliness' }, 
        value: { $avg: '$value' }, 
      } },
    ]).exec();
    if(average.length > 0){
      const user = await cookData.updateOne({
        rating: average[0].rating,
        communication: average[0].communication,
        presentation: average[0].presentation,
        taste: average[0].taste,
        punctuality: average[0].punctuality,
        cleanliness: average[0].cleanliness,
        value: average[0].value,
      });
    } else {
      const user = await cookData.updateOne({
          rating: 0,
          communication: 0,
          presentation: 0,
          taste: 0,
          punctuality: 0,
          cleanliness: 0,
          value: 0,
        });
    }
  }
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });
  res.cookie("message", "Deleted Successfully", { httpOnly: true });
  return res.redirect('/reviews?page='+req.query.page+'&limit='+req.query.title+'&title='+req.query.title+'&from='+req.query.from+'&to='+req.query.to+'&ratedata='+req.query.ratedata);
};

//cook edit view
exports.editView = async function(req, res) {
  const review = await Review.findOne({_id : req.params.id});
  var message = req.cookies["message"];
  res.clearCookie("message", { httpOnly: true });

  return res.render('reviewedit.twig', {
      title : "Review Edit",
      url : "reviews",
      message : message,
      reviewData : JSON.parse(JSON.stringify(review)),
      BASE_URL : BASE_URL,
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
exports.update = async function(req, res) {
  var { title, description, rate, communication, presentation, taste, punctuality, cleanliness, value} = req.body;
  const ReviewData = await Review.findOne({_id : req.params.id});

  const data = await ReviewData.updateOne({
      title, description, rate, communication, presentation, taste, punctuality, cleanliness, value,
      updated_at: new Date()
    });
  const newCookData = await Review.findOne({ _id:  req.params.id});
  res.cookie("message", "updated Successfully", { httpOnly: true });
  return res.redirect('/review/edit/'+req.params.id);
};
