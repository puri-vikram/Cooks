require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/webAuth");

const User = require("../../model/user");
const Cook = require("../../model/cook");
const Recipe = require("../../model/recipe");
const Review = require("../../model/review");

var mongoose = require('mongoose');

// add review
exports.add = async function(req, res) {
  // Our register logic starts here
  try {
    const { title, rate, description, cook_id } = req.body;
    if (!(title && rate && description && cook_id)) {
      return res.status(400).send({"status": false,'message': "All input is required"});
    }
    const review = await Review.create({
      title,
      description,
      rate,
      user_id: req.user.user_id,
      cook_id,
      created_at: new Date(),
      updated_at: new Date()
    });
    const cookData = await Cook.findOne({_id : cook_id});
    const average = await Review.aggregate([
      { $match: { cook_id: new mongoose.Types.ObjectId(cook_id) } },
      { $group: { _id: cook_id, average: { $avg: '$rate' } } },
    ]).exec();
    const user = await cookData.updateOne({
      rating: average[0].average
    });

    const newReviewData = await Review.findOne({ _id:  review._id});
    return res.status(201).json({"status": true, 'data': newReviewData, 'message': "Added Successfully"});
    //res.status(201).json(average);
  } catch (err) {
    console.log(err);
  }
};

// edit review
exports.edit = async function(req, res) {
  // Our register logic starts here
  try {
    const { title, rate, description, cook_id } = req.body;
    if (!(title && rate && description && cook_id)) {
      return res.status(400).send({"status": false,'message': "All input is required"});
    }
    var ReviewData = await Review.findOne({ _id: req.params.id, user_id: req.user.user_id});

    if(ReviewData){
      ReviewData = await ReviewData.updateOne({
        title,
        description,
        rate,
        user_id: req.user.user_id,
        cook_id,
        created_at: new Date(),
        updated_at: new Date()
      });
      const cookData = await Cook.findOne({_id : cook_id});
      const average = await Review.aggregate([
        { $match: { cook_id: new mongoose.Types.ObjectId(cook_id) } },
        { $group: { _id: cook_id, average: { $avg: '$rate' } } },
      ]).exec();
      const user = await cookData.updateOne({
        rating: average[0].average
      });

      const newReviewData = await Review.findOne({ _id:  req.params.id});
      return res.status(201).json({"status": true, 'data': newReviewData, 'message': "Added Successfully"});
    } else {
      return res.status(400).json({"status": false, 'message': "Not a valid user"});
    }
  } catch (err) {
    console.log(err);
  }
};

// edit reply
exports.reply = async function(req, res) {
  // Our register logic starts here
  try {
    const { cook_comment } = req.body;
    if (!(cook_comment)) {
      return res.status(400).send({"status": false,'message': "All input is required"});
    }
    var ReviewData = await Review.findOne({ _id: req.params.id, cook_id: req.user.user_id});

    if(ReviewData){
      ReviewData = await ReviewData.updateOne({
        cook_comment,
        cook_comment_at: new Date()
      });
     

      const newReviewData = await Review.findOne({ _id:  req.params.id});
      return res.status(201).json({"status": true, 'data': newReviewData, 'message': "Added Successfully"});
    } else {
      return res.status(400).json({"status": false, 'message': "Not a valid user"});
    }
  } catch (err) {
    console.log(err);
  }
};

// edit reply
exports.editReply = async function(req, res) {
  // Our register logic starts here
  try {
    const { cook_comment } = req.body;
    if (!(cook_comment)) {
      return res.status(400).send({"status": false,'message': "All input is required"});
    }
    var ReviewData = await Review.findOne({ _id: req.params.id, cook_id: req.user.user_id});

    if(ReviewData){
      ReviewData = await ReviewData.updateOne({
        cook_comment,
        cook_comment_at: new Date()
      });
     

      const newReviewData = await Review.findOne({ _id:  req.params.id});
      return res.status(201).json({"status": true, 'data': newReviewData, 'message': "Added Successfully"});
    } else {
      return res.status(400).json({"status": false, 'message': "Not a valid user"});
    }
  } catch (err) {
    console.log(err);
  }
};

// edit reply
exports.deletereply = async function(req, res) {
  // Our register logic starts here
  try {
    
    var ReviewData = await Review.findOne({ _id: req.params.id, cook_id: req.user.user_id});

    if(ReviewData){
      ReviewData = await ReviewData.updateOne({
        cook_comment:null,
        cook_comment_at: null
      });
     

      const newReviewData = await Review.findOne({ _id:  req.params.id});
      return res.status(201).json({"status": true, 'data': newReviewData, 'message': "Added Successfully"});
    } else {
      return res.status(400).json({"status": false, 'message': "Not a valid user"});
    }
  } catch (err) {
    console.log(err);
  }
};


// delete review
exports.delete = async function(req, res) {

  try {
    if(req.user.login_as == 'cook'){
      var review = await Review.deleteOne({ _id:  req.params.id, cook_id : req.user.user_id});
    } else {
      var review = await Review.deleteOne({ _id:  req.params.id, user_id : req.user.user_id});
    }
    if(review.deletedCount == 0){
      return res.status(201).json({"status": false, 'message': "Something went wrong!"});
    }
    return res.status(201).json({"status": true, 'message': "Deleted Successfully"});
  } catch (err) {
    console.log(err);
  }
};