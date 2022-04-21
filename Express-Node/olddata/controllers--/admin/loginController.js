require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/webAuth");

const User = require("../../model/user");
const Cook = require("../../model/cook");
const Recipe = require("../../model/recipe");
const Recipetype = require("../../model/recipetype");

// Login view
exports.loginView = function(req, res) {
    if(req.session && req.session.email){
	    return res.redirect('/dashboard');
	}
	var message = req.cookies["message"];
  	res.clearCookie("message", { httpOnly: true });
	return res.render('login.twig', {
	    message : message,
	});   
};

// Login post
exports.login = async function(req, res) {
    try {
	    const { email, password } = req.body;
	    if (!(email && password)) {
	      	return res.status(400).send("All input is required");
	    }

	    const user = await User.findOne({ email:email, is_admin: "1" });
	    if (user && (await bcrypt.compare(password, user.password))) {
	      	req.session.email = user.email;
	      	req.session.name = user.firstname+" "+user.lastname;
	      	req.session.admin = true;
	      	res.cookie("message", "Login Successfully", { httpOnly: true });
	      	return res.redirect('/dashboard');
	    }
	    res.cookie("message", "Something went wrong", { httpOnly: true });
	    return res.redirect('/login');
	} catch (err) {
	    console.log(err);
	}
};

// logout post
exports.logout = function(req, res) {
    req.session.destroy();
  	return res.redirect('/');
};