require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const MAIL = require("../../config/mail");
const { MAIL_FROM } = process.env;
const { MAIL_TO } = process.env;

const Cuisine = require("../../model/cuisine");
const Dietary = require("../../model/dietary");
const Meal = require("../../model/meal");
const Language = require("../../model/language");

// search
exports.search = async function(req, res) {
  // Our register logic starts here
  try {
    const { type, value} = req.body;
    var data = [];
    if(type == 'language'){
      data = await Language.find({name: { $regex: '.*' + value + '.*' }},{_id:0,name:1});
    }
    if(type == 'meal'){
      data = await Meal.find({name: { $regex: '.*' + value + '.*' }},{_id:0,name:1});
    }
    if(type == 'dietary'){
      data = await Dietary.find({name: { $regex: '.*' + value + '.*' }},{_id:0,name:1});
    }
    if(type == 'cuisine'){
      data = await Cuisine.find({name: { $regex: '.*' + value + '.*' }},{_id:0,name:1});
    }
    return res.status(200).send(data);

  } catch (err) {
    console.log(err);
  }
};

// suggestion
exports.suggestion = async function(req, res) {
  // Our register logic starts here
  try {
    const { type, value} = req.body;
    if (!(type && value)) {
      return res.status(400).send({"status": false,'message': "All inputs are required"});
    }
    let mailDetails = {
        from: MAIL_FROM,
        to: MAIL_TO,
        subject: 'Preference suggestion',
        //html: 'Thanks for register<br><a href="'+BASE_URL+'verify/cook/'+user._id+'" target="_blank">Click here to Verify your email</a>'
        html: '<!DOCTYPE html> <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width,initial-scale=1"> <meta name="x-apple-disable-message-reformatting"> <title></title> <!--[if mso]> <style> table {border-collapse:collapse;border-spacing:0;border:none;margin:0;} div, td {padding:0;} div {margin:0 !important;} </style> <noscript> <xml> <o:OfficeDocumentSettings> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript> <![endif]--> <style> table, td, div, h1, p {font-family: Arial, sans-serif; } @media screen and (max-width: 530px) {.unsub {display: block; padding: 8px; margin-top: 14px; border-radius: 6px; background-color: #555555; text-decoration: none !important; font-weight: bold; } .col-lge {max-width: 100% !important; } } @media screen and (min-width: 531px) {.col-sml {max-width: 27% !important; } .col-lge {max-width: 73% !important; } } </style> </head> <body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;"> <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;"> <table role="presentation" style="width:100%;border:none;border-spacing:0;"> <tr> <td align="center" style="padding:0;"> <!--[if mso]> <table role="presentation" align="center" style="width:600px;"> <tr> <td> <![endif]--> <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;"> <tr> <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;"> <a href="http://www.example.com/" style="text-decoration:none;"><img src="https://server.visionvivante.com/cookreact/logo/book-your-cook-logo-white.png" width="165" alt="Logo" style="width:165px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;"></a> </td> </tr> <tr> <td style="padding:30px;background-color:#ffffff;"> <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">Preference suggestion !</h1> <p style="margin:0;"><b>Type</b>: '+type+'</p><p><b>suggesion</b>: '+value+'</p> </td> </tr> <tr> <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;"> <p style="margin:0 0 8px 0;"><a href="http://www.facebook.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/facebook_1.png" width="40" height="40" alt="f" style="display:inline-block;color:#cccccc;"></a> <a href="http://www.twitter.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/twitter_1.png" width="40" height="40" alt="t" style="display:inline-block;color:#cccccc;"></a></p> <p style="margin:0;font-size:14px;line-height:20px;">&reg; Book Your Cook, 2022<br><a class="unsub" href="https://server.visionvivante.com/cookreact/" style="color:#cccccc;text-decoration:underline;">Subscribe instantly</a></p> </td> </tr> </table> <!--[if mso]> </td> </tr> </table> <![endif]--> </td> </tr> </table> </div> </body> </html>'
    };
    MAIL.mailTransporter.sendMail(mailDetails, function(err, data) {
    });
    return res.status(201).json({"status": true, 'message': "Send Successfully"});

  } catch (err) {
    console.log(err);
  }
};
