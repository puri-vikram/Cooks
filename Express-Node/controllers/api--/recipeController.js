require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/webAuth");

const User = require("../../model/user");
const Cook = require("../../model/cook");
const Recipe = require("../../model/recipe");
const Recipetype = require("../../model/recipetype");

//List of recepie
exports.list = async function(req, res) {
  const limit =  Number(req.query.limit ? req.query.limit : 10);
  const page =  Number(req.query.page ? (req.query.page-1) : 0);
  const recipe = await Recipe.find(null, null, { skip: (page*limit), limit: limit });
  res.status(200).send(recipe);
};

//List of recepie
exports.detail = async function(req, res) {
  const newRecipeData = await Recipe.findOne({ _id:  req.params.id});
  res.status(200).send(newRecipeData);
};

//List of recepie
exports.cooklist = async function(req, res) {
  const limit =  Number(req.query.limit ? req.query.limit : 10);
  const page =  Number(req.query.page ? (req.query.page-1) : 0);
  const recipe = await Recipe.find({user_id: req.user.user_id}, null, { skip: (page*limit), limit: limit });
  res.status(200).send(recipe);
};

// add recipe
exports.add = async function(req, res) {
  // Our register logic starts here
  try {
    const { title, type, description, diet_type, meal_type, cuisine_type, best_recipes, speciality, recipe_hours, recipe_minute, why_work, ingredients, categories } = req.body;
    if (!(title && description)) {
      return res.status(400).send({"status": false,'message': "All input is required"});
    }
    const recipe = await Recipe.create({
      title,
      type,
      description,
      user_id: req.user.user_id,
      diet_type, 
      meal_type, 
      cuisine_type, best_recipes, speciality,
      recipe_hours, recipe_minute, why_work, ingredients, categories
    });

    const newRecipeData = await Recipe.findOne({ _id:  recipe._id});
    res.status(201).json({"status": true, 'data': newRecipeData, 'message': "Added Successfully"});
  } catch (err) {
    console.log(err);
  }
};

// add recipe
exports.delete = async function(req, res) {
  // Our register logic starts here
  try {
    const recipe = await Recipe.deleteOne({ _id:  req.params.id, user_id : req.user.user_id});
    if(recipe.deletedCount == 0){
      return res.status(201).json({"status": false, 'message': "Something went wrong!"});
    }
    return res.status(201).json({"status": true, 'message': "Deleted Successfully"});
  } catch (err) {
    console.log(err);
  }
};

// recipe cook
exports.update = async function(req, res) {
  // Our register logic starts here
  try {
    const { title, type, description, images, diet_type, meal_type, cuisine_type, best_recipes, speciality , recipe_hours, recipe_minute, why_work, ingredients, categories} = req.body;
    // if (!(firstname && lastname)) {
    //   return res.status(400).send("All input is required");
    // }
    const RecipeData = await Recipe.findOne({ _id:  req.params.id, user_id : req.user.user_id});
    const user = await RecipeData.updateOne({
      title,
      type,
      description,
      images,
      diet_type, 
      meal_type, 
      cuisine_type, best_recipes, speciality,
      recipe_hours, recipe_minute, why_work, ingredients, categories
    });
    const newRecipeData = await Recipe.findOne({ _id:  req.params.id, user_id : req.user.user_id});
    res.status(201).json({"status": true, 'data': newRecipeData, 'message': "Updated Successfully"});
  } catch (err) {
    console.log(err);
  }
};

// Update recipe images
exports.uploadImages = async function(req, res) {
   const images = req.files.map(data => { return "recipe/"+data.filename});
  try {
    if(images){
      const RecipeData = await Recipe.findOne({ _id:  req.params.id, user_id : req.user.user_id});
      const recipe = await RecipeData.updateOne({
         $push:{images: images}
      });
      const newRecipeData = await Recipe.findOne({ _id:  req.params.id, user_id : req.user.user_id});
      res.status(201).json({"status": true, 'data': newRecipeData, 'message': "Updated Successfully"});
    } else {
      res.status(500).json({"status": false, 'message': "not a valid image"});
    }
  } catch (err) {
    console.log(err);
  }
};

// add recipe type
exports.addRecipeType = async function(req, res) {
   try {
    const { name } = req.body;
    if (!(name)) {
      return res.status(400).send({"status": false,'message': "All input is required"});
    }
    const recipe = await Recipetype.create({
      name
    });

    const newRecipeTypeData = await Recipetype.findOne({ _id:  recipe._id});
    res.status(201).json(newRecipeTypeData);
  } catch (err) {
    console.log(err);
  }
};