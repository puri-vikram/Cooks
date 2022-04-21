require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/webAuth");

const User = require("../../model/user");
const Cook = require("../../model/cook");
const Recipe = require("../../model/recipe");
const Recipetype = require("../../model/recipetype");
const Review = require("../../model/review");

// Dashboard View
exports.dashboardView = async function(req, res) {
	var message = req.cookies["message"];
  	var UserCount = await User.count();
  	var CookCount = await Cook.count();
  	var ReviewCount = await Review.count();
  	res.clearCookie("message", { httpOnly: true });
    return res.render('dashboard.twig', {
	    title : "Dashboard",
	    url : "dashboard",
	    message : message,
	    UserCount : UserCount,
	    CookCount : CookCount,
	    ReviewCount : ReviewCount,
	    req : req,
	});  
};
