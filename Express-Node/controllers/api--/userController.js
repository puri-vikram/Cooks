require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/webAuth");

const User = require("../../model/user");
const Cook = require("../../model/cook");
const Recipe = require("../../model/recipe");
const Recipetype = require("../../model/recipetype");

const MAIL = require("../../config/mail");
const { MAIL_FROM } = process.env;
const { BASE_URL } = process.env;

// Register user
exports.register = async function(req, res) {
  try {
    // Get user input
    const { firstname, lastname, email, password } = req.body;

    // Validate user input
    if (!(email && password && firstname && lastname)) {
      return res.status(400).send({"status": false,'message': "All input is required"});
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send({"status": false,'message': "Email Already Exist. Please Login"});
    }

    const oldCook = await Cook.findOne({ email });

    if (oldCook) {
      return res.status(409).send({"status": false,'message': "Email Already Exist. Please Login"});
    }
    
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    var user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
   // user.token = token;
    user = user.toJSON();
    user.role = 'user';

    let mailDetails = {
        from: MAIL_FROM,
        to: user.email,
        subject: 'Verify your email',
       // html: 'Thanks for register<br><a href="'+BASE_URL+'verify/user/'+user._id+'" target="_blank">Click here to Verify your email</a>'
       html: '<!DOCTYPE html> <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width,initial-scale=1"> <meta name="x-apple-disable-message-reformatting"> <title></title> <!--[if mso]> <style> table {border-collapse:collapse;border-spacing:0;border:none;margin:0;} div, td {padding:0;} div {margin:0 !important;} </style> <noscript> <xml> <o:OfficeDocumentSettings> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript> <![endif]--> <style> table, td, div, h1, p {font-family: Arial, sans-serif; } @media screen and (max-width: 530px) {.unsub {display: block; padding: 8px; margin-top: 14px; border-radius: 6px; background-color: #555555; text-decoration: none !important; font-weight: bold; } .col-lge {max-width: 100% !important; } } @media screen and (min-width: 531px) {.col-sml {max-width: 27% !important; } .col-lge {max-width: 73% !important; } } </style> </head> <body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;"> <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;"> <table role="presentation" style="width:100%;border:none;border-spacing:0;"> <tr> <td align="center" style="padding:0;"> <!--[if mso]> <table role="presentation" align="center" style="width:600px;"> <tr> <td> <![endif]--> <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;"> <tr> <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;"> <a href="http://www.example.com/" style="text-decoration:none;"><img src="https://server.visionvivante.com/cookreact/logo/book-your-cook-logo.png" width="165" alt="Logo" style="width:165px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;"></a> </td> </tr> <tr> <td style="padding:30px;background-color:#ffffff;"> <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">Welcome to Book Your cook !</h1> <p style="margin:0;">Thanks for register<br> <a href="'+BASE_URL+'verify/user/'+user._id+'" target="_blank" style="color:#e50d70;text-decoration:underline;">Click Here</a> to Verify your email.</p> </td> </tr> <tr> <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;"> <p style="margin:0 0 8px 0;"><a href="http://www.facebook.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/facebook_1.png" width="40" height="40" alt="f" style="display:inline-block;color:#cccccc;"></a> <a href="http://www.twitter.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/twitter_1.png" width="40" height="40" alt="t" style="display:inline-block;color:#cccccc;"></a></p> <p style="margin:0;font-size:14px;line-height:20px;">&reg; Book Your Cook, 2022<br><a class="unsub" href="https://server.visionvivante.com/cookreact/" style="color:#cccccc;text-decoration:underline;">Subscribe instantly</a></p> </td> </tr> </table> <!--[if mso]> </td> </tr> </table> <![endif]--> </td> </tr> </table> </div> </body> </html>'
    };
    MAIL.mailTransporter.sendMail(mailDetails, function(err, data) {
    });

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

// Update user
exports.update = async function(req, res) {
   // Our register logic starts here
  try {
    const { firstname, lastname, about_me, country, state, city, zipcode, address, lat, lng,} = req.body;
    if (!(firstname && lastname)) {
      return res.status(400).send({"status": false,'message': "All input is required"});
    }
    const UserData = await User.findOne({ _id:  req.user.user_id});
    var loca = { type: 'Point', coordinates: [] };
    const user = await UserData.updateOne({
      firstname,
      lastname,
      lat,
      lng,
      about_me, 
      country, 
      state, 
      city, 
      zipcode, 
      address
    });
    if(lat && lng){
      loca = { type: 'Point', coordinates: [lat, lng] };
        const user = await UserData.updateOne({
        
        location:loca,
        
      });
    }
    var newUserData = await User.findOne({ _id:  req.user.user_id}).lean().exec(); 
    newUserData.role = 'user';
    res.status(201).json({"status": true, 'data': newUserData, 'message': "Updated Successfully"});
  } catch (err) {
    console.log(err);
  }
};

// Update user
exports.uploadPictures = async function(req, res) {
  try {
    const CookData = await User.findOne({ _id:  req.user.user_id});
    const user = await CookData.updateOne({
      pictures: "user/"+req.file.filename
    });
    var newUserData = await User.findOne({ _id:  req.user.user_id}).lean().exec(); 
    newUserData.role = 'user';
    res.status(201).json({"status": true, 'data': newUserData, 'message': "Updated Successfully"});
  } catch (err) {
    console.log(err);
  }
};