require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/webAuth");

const User = require("../../model/user");
const Cook = require("../../model/cook");
const Recipe = require("../../model/recipe");
const Recipetype = require("../../model/recipetype");
var haversine = require("haversine-distance");
const Review = require("../../model/review");
const Message = require("../../model/message"); 

const MAIL = require("../../config/mail");
const { MAIL_FROM } = process.env;
const { BASE_URL } = process.env;

//List of cooks
exports.list = async function(req, res) {
  const limit =  Number(req.query.limit ? req.query.limit : 10);
  const page =  Number(req.query.page ? (req.query.page-1) : 0);
  const lat =  req.query.lat ? req.query.lat : null;
  const lng =  req.query.lng ? req.query.lng : null;
  const user = await Cook.find(null, null, { skip: (page*limit), limit: limit }).lean().exec();

  
  //   var haversine_m = haversine(point1, point2);
  //   var haversine_km = haversine_m /1000;

  // console.log("distance (in meters): " + haversine_m + "m");
  // console.log("distance (in kilometers): " + haversine_km + "km");
  user.forEach(x => {
    if(lat && lng && x.lat && x.lng){
      var point1 = { lat: lat, lng: lng };
      var point2 = { lat: x.lat, lng: x.lng };
      x.distance = (haversine(point1, point2)/1000).toFixed(2) + "km";
    } else {
      x.distance = null;
    }
  });
  res.status(200).send(user);
};

//Search of cooks
exports.search = async function(req, res) {

  // {
  //   "page": 1,
  //   "limit":10,
  //   "priceOrder": "DESC",
  //   "distance": 20,
  //   "distance_type":"km",
  //   "lat": -73.99279,
  //   "lng": 40.719296,
  //   "rating":3,
  //   "diet_type" :["keto"],
  //   "diet_type_opr":"AND",
  //   "meal_type":["lunch"],
  //   "meal_type_opr":"AND",
  //   "cuisine_type":["french"],
  //   "cuisine_type_opr":"AND",
  //   "profession":"cook",
  //   "languages":["english"],
  //   "language_opr":"AND"
  // }
  const limit =  Number(req.body.limit ? req.body.limit : 10);
  const page =  Number(req.body.page ? (req.body.page-1) : 0);
  const lat =  req.body.lat ? req.body.lat : null;
  const lng =  req.body.lng ? req.body.lng : null;
  const diet_type =  req.body.diet_type ? req.body.diet_type : [];
  const diet_type_opr =  req.body.diet_type_opr ? req.body.diet_type_opr : null;
  const meal_type =  req.body.meal_type ? req.body.meal_type : [];
  const meal_type_opr =  req.body.meal_type_opr ? req.body.meal_type_opr : null;
  const cuisine_type =  req.body.cuisine_type ? req.body.cuisine_type : [];
  const cuisine_type_opr =  req.body.cuisine_type_opr ? req.body.cuisine_type_opr : null;
  const languages =  req.body.languages ? req.body.languages : [];
  const language_opr =  req.body.language_opr ? req.body.language_opr : null;
  const orderDir =  req.body.priceOrder ? ((req.body.priceOrder == "ASC")? 1 : -1) : -1;
  const orderType =  req.body.orderType ? req.body.orderType : 'price';
  var distance =   req.body.distance ? Number(req.body.distance) : 5;
  const distance_type =   req.body.distance_type ? req.body.distance_type : 'km';

  var filter = {};
  
  var latLngUser =[]; 
  var recipeUser =[]; 
  if(lat && lng){
    if(distance_type == 'km'){
      distance = distance * 1000; ///return meter
    } else {
      distance = distance * 1609.34;  ///return meter
    }
    var CookData = await Cook.aggregate(
      [
          { "$geoNear": {
              "near": {
                  "type": "Point",
                  "coordinates": [Number(lng), Number(lat)]
              },
              "distanceField": "dist.calculated",
              "includeLocs": "dist.location",
              "spherical": true,
              "maxDistance": distance
          }}
      ]);
    latLngUser = CookData.map(data => { return data._id; });
    //console.log(latLngUser);

    if(latLngUser.length <= 0){

      return res.status(200).send([]);
    }
    
  }

  if(latLngUser.length){ 
    filter['_id'] = {$in: latLngUser};
  }
  if(req.body.hourly_rate_min && req.body.hourly_rate_max){
    //filter['hourly_rate'] = { $gte: Number(req.body.hourly_rate_min), $lte: Number(req.body.hourly_rate_max) };
    filter['hourly_rate'] = { $lte: Number(req.body.hourly_rate_max) };
  }
  if(req.body.rating){
    filter['rating'] = { $gte: (req.body.rating) };
  }
  if(req.body.profession){
    filter['profession'] = req.body.profession;
  }
  if(languages.length > 0){
    if(language_opr && language_opr == 'AND'){
      filter['languages'] = {$all: languages};
    } else {
       filter['languages'] = {$in: languages};
    }
  }

  if(diet_type.length > 0){
    if(diet_type_opr && diet_type_opr == 'AND'){
      filter['dietary_preference'] = {$all: diet_type};
    } else {
      filter['dietary_preference'] = {$in: diet_type};
    }
  }
  if(meal_type.length > 0){
    //filter['meal_type'] = {$in: meal_type};
    if(meal_type_opr && meal_type_opr == 'AND'){
      filter['meal_type'] = {$all: meal_type};
    } else {
      filter['meal_type'] = {$in: meal_type};
    }
  }
  if(cuisine_type.length > 0){
    //filter['cuisine_preference'] = {$in: cuisine_type};
    if(cuisine_type_opr && cuisine_type_opr == 'AND'){
      filter['cuisine_preference'] = {$all: cuisine_type};
    } else {
      filter['cuisine_preference'] = {$in: cuisine_type};
    }
  }

  var user = null;
  if(orderType == 'price'){
    user = await Cook.find(filter, null, { skip: (page*limit), limit: limit, sort:{hourly_rate: orderDir } }).lean().exec();
  } else {
    user = await Cook.find(filter, null, { skip: (page*limit), limit: limit, sort:{created_at: -1 } }).lean().exec();
  }
  var isDistanceMeasure = false;
  user.forEach(x => {
    x.distance_type = distance_type;
    if(lat && lng && x.lat && x.lng){
      var point1 = { lat: Number(lat), lng: Number(lng) };
      var point2 = { lat: Number(x.lat), lng: Number(x.lng) };
      //x.distance = (haversine(point1, point2)/1000).toFixed(2) + "km";
      var distancedata = CookData.filter(userd => userd.email === x.email);
      if(distancedata.length){
        isDistanceMeasure = true;
        //x.distance = distancedata[0].dist;
        if(distance_type == 'km'){
          x.distance = Number((distancedata[0].dist.calculated*0.001).toFixed(2));
        } else {
          x.distance = Number((distancedata[0].dist.calculated*0.000621371).toFixed(2));
        }
      } else {
        x.distance = null;
      }
    } else {
      x.distance = null;
    }
  });
  if(isDistanceMeasure && orderType == 'distance'){
    user.sort((a,b)=> (a.distance > b.distance ? 1 : -1))
  }
  return res.status(200).send(user);
};
// exports.search = async function(req, res) {

//   // {
//   //   "page": 1,
//   //   "limit":10,
//   //   "priceOrder": "DESC",
//   //   "distance": 20000,
//   //   "lat": -73.99279,
//   //   "lng": 40.719296,
//   //   "rating":3,
//   //   "diet_type" :["keto"],
//   //   "meal_type":["lunch"],
//   //   "cuisine_type":["french"],
//   //   "profession":"cook",
//   //   "languages":["english"]
//   // }
//   const limit =  Number(req.body.limit ? req.body.limit : 10);
//   const page =  Number(req.body.page ? (req.body.page-1) : 0);
//   const lat =  req.body.lat ? req.body.lat : null;
//   const lng =  req.body.lng ? req.body.lng : null;
//   const diet_type =  req.body.diet_type ? req.body.diet_type : [];
//   const meal_type =  req.body.meal_type ? req.body.meal_type : [];
//   const cuisine_type =  req.body.cuisine_type ? req.body.cuisine_type : [];
//   const languages =  req.body.languages ? req.body.languages : [];
//   const priceOrder =  req.body.priceOrder ? ((req.body.priceOrder == "ASC")? 1 : -1) : -1;
//   const distance =   req.body.distance ? req.body.distance : 20000;

//   var filter = {};
  
//   var latLngUser =[]; 
//   var recipeUser =[]; 
//   if(lat && lng){
//     var CookData = await Cook.aggregate(
//       [
//           { "$geoNear": {
//               "near": {
//                   "type": "Point",
//                   "coordinates": [Number(lat),Number(lng)]
//               },
//               "distanceField": "dist.calculated",
//               "includeLocs": "dist.location",
//               "spherical": true,
//               "maxDistance": distance
//           }}
//       ]);
//     latLngUser = CookData.map(data => { return data._id; });


//     if(latLngUser.length <= 0){

//       return res.status(200).send([]);
//     }
    
//   }

//   var recipeFilter = {};
//   if(diet_type.length > 0){
//     recipeFilter['diet_type'] = {$in: diet_type};
//   }
//   if(meal_type.length > 0){
//     recipeFilter['meal_type'] = {$in: meal_type};
//   }
//   if(cuisine_type.length > 0){
//     recipeFilter['cuisine_type'] = {$in: cuisine_type};
//   }
//   if(latLngUser.length){ //if location
//     recipeFilter['user_id'] = {$in: latLngUser};
//     var RecipeData = await Recipe.find(recipeFilter);
//     recipeUser = RecipeData.map(data => { return data.user_id; });
//     filter['_id'] = {$in: recipeUser};
//   } else { //if other
//     if(Object.keys(recipeFilter).length != 0){
//       var RecipeData = await Recipe.find(recipeFilter);
//       recipeUser = RecipeData.map(data => { return data.user_id; });
//       filter['_id'] = {$in: recipeUser};
//     }
//   }
 

//   if(req.body.hourly_rate_min && req.body.hourly_rate_max){
//     filter['hourly_rate'] = { $gte: req.body.hourly_rate_min, $lte: req.body.hourly_rate_max };
//   }
//   if(req.body.rating){
//     filter['rating'] = { $gte: (req.body.rating- 1), $lte: req.body.rating };
//   }
//   if(req.body.profession){
//     filter['profession'] = req.body.profession;
//   }
//   if(languages.length > 0){
//     filter['languages'] = {$in: languages};
//   }

//   const user = await Cook.find(filter, null, { skip: (page*limit), limit: limit, sort:{hourly_rate: priceOrder } }).lean().exec();
//   user.forEach(x => {
//     if(lat && lng && x.lat && x.lng){
//       var point1 = { lat: Number(lat), lng: Number(lng) };
//       var point2 = { lat: Number(x.lat), lng: Number(x.lng) };
//       //x.distance = (haversine(point1, point2)/1000).toFixed(2) + "km";
//       var distancedata = CookData.filter(userd => userd.email === x.email);
//       if(distancedata.length){
//         //x.distance = distancedata[0].dist;
//         x.distance = (distancedata[0].dist.calculated/1000).toFixed(2) + "km";
//       } else {
//         x.distance = null;
//       }
//     } else {
//       x.distance = null;
//     }
//   });
//   return res.status(200).send(user);
// };

//Cooks detail
exports.detail = async function(req, res) {
  const user = await Cook.findOne({_id : req.params.id}).lean().exec();
  if(user){
    user.distance = null;
    if(req.query.lat && req.query.lng && req.query.lat != '' && req.query.lng != ''){
      var point1 = { lat: user.lat, lng: user.lng };
      var point2 = { lat: req.query.lat, lng: req.query.lng };
      user.distance = (haversine(point1, point2)/1000).toFixed(2) + "km";
    } else {
      var CookData = await User.findOne({ _id:  req.user.user_id});
      if(!CookData){
         CookData = await Cook.findOne({ _id:  req.user.user_id});
      }
      if(CookData.lat != '' && CookData.lng != ''){
        var point1 = { lat: user.lat, lng: user.lng };
        var point2 = { lat: CookData.lat, lng: CookData.lng };
        user.distance = (haversine(point1, point2)/1000).toFixed(2) + "km";
      }
    }
    user.best_recipes = await Recipe.find({user_id : req.params.id, best_recipes : true});
    //user.speciality = await Recipe.find({user_id : req.params.id, speciality : true});
    user.isAlreadyReview = await Review.countDocuments({user_id: req.user.user_id, cook_id : req.params.id});
  }
  res.status(200).send(user);
};

//get all reviews
exports.reviews = async function(req, res) {
  const limit =  Number(req.query.limit ? req.query.limit : 10);
  const page =  Number(req.query.page ? (req.query.page-1) : 0);
  const reviews = await Review.find({cook_id : req.params.id}, null, { skip: (page*limit), limit: Number(limit) }).populate('user').lean().exec();
  res.status(200).send(reviews);
};

//get featured chefs and cooks
exports.featuredchefsandcooks = async function(req, res) {

  var dateBefore14days = new Date(new Date().getTime()-(14*24*60*60*1000));
  var cookIds  = await Message.aggregate( [ 
    { $match:{ 'from': 'cook'} },  ///cook reply to all 
    { $match:{ 'created_at': {$gte : dateBefore14days}} }, ///in last 14 days
    { $sort:{ 'created_at': -1} },
    { $group : { _id : "$cook_id" } } 
  ] )
  var cookIds = cookIds.map(data => { return data._id; });  //cook ids for last 14 days with reply

  const forMessageCount = await Cook.find({_id:  {$in: cookIds}}).populate({path: 'unreadCount',match: { from: 'user' } }).lean().exec();
  var cookIdsMessageAbove5 = [];  ///cooks whose message above 5 
  forMessageCount.forEach(x => {
    if(x.unreadCount >= 5){
      cookIdsMessageAbove5.push(x._id);
    }
  });
  var cookIdsMessageAbove5FrmDiff = [];
  for await (const cid of cookIdsMessageAbove5) {
    var userC = await Message.find({ 'cook_id': cid, 'created_at': {$gte : dateBefore14days}}).distinct('user_id');
    //console.log(userC.length)
    if(userC.length >= 4){
      cookIdsMessageAbove5FrmDiff.push(cid);
    }
  }
  //console.log(cookIdsMessageAbove5FrmDiff)

  const forReviewAbove3 = await Cook.find({_id:  {$in: cookIdsMessageAbove5FrmDiff}}).populate('reviewCount').lean().exec();
  var cookIdsReviewAbove3 = [];  ///cooks whose review count is gte 3
  forReviewAbove3.forEach(x => {
    if(x.reviewCount >= 3){
      cookIdsReviewAbove3.push(x._id);
    }
  });

  const cookAboveRaing4 = await Cook.find({_id:  {$in: cookIdsMessageAbove5FrmDiff}, rating :{$gte : 4}}).lean().exec(); ///cooks whose rating gte 4
  var cookIdsAboveRaing4 = cookAboveRaing4.map(data => { return data._id; });

  const allIds = cookIdsAboveRaing4.concat(cookIdsReviewAbove3); //merge 2 array

  const featured = await Cook.find({_id:  {$in: allIds}}, null, { skip: 0, limit: 10 }).sort({ rating: 'desc'}).lean().exec();

  const top = await Cook.find({}, null, { skip: 0, limit: 10 }).sort({ rating: 'desc'}).lean().exec();
  res.status(200).send({featured: featured, top: top});
};

// Register cook
exports.register = async function(req, res) {
  try {
    // Get user input
    const { firstname, lastname, email, password , lat, lng} = req.body;

    // Validate user input
    if (!(email && password && firstname && lastname)) {
      return res.status(400).send({"status": false,'message': "All input is required"});
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldCook = await Cook.findOne({ email });

    if (oldCook) {
      return res.status(409).send({"status": false,'message': "Email Already Exist. Please Login"});
    }
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send({"status": false,'message': "Email Already Exist. Please Login"});
    }


    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    var loca = {};
    if(lat && lng){
      loca = { type: 'Point', coordinates: [lng, lat] };
    }

    // Create user in our database
    var user = await Cook.create({
      firstname,
      lastname,
      lat,
      lng,
      created_at: new Date(), // sanitize: convert email to lowercase
      updated_at: new Date(), // sanitize: convert email to lowercase
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      location:loca
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
    //user.token = token;
    user = user.toJSON();
    user.role = 'cook';

    let mailDetails = {
        from: MAIL_FROM,
        to: user.email,
        subject: 'Verify your email',
        //html: 'Thanks for register<br><a href="'+BASE_URL+'verify/cook/'+user._id+'" target="_blank">Click here to Verify your email</a>'
        html: '<!DOCTYPE html> <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width,initial-scale=1"> <meta name="x-apple-disable-message-reformatting"> <title></title> <!--[if mso]> <style> table {border-collapse:collapse;border-spacing:0;border:none;margin:0;} div, td {padding:0;} div {margin:0 !important;} </style> <noscript> <xml> <o:OfficeDocumentSettings> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript> <![endif]--> <style> table, td, div, h1, p {font-family: Arial, sans-serif; } @media screen and (max-width: 530px) {.unsub {display: block; padding: 8px; margin-top: 14px; border-radius: 6px; background-color: #555555; text-decoration: none !important; font-weight: bold; } .col-lge {max-width: 100% !important; } } @media screen and (min-width: 531px) {.col-sml {max-width: 27% !important; } .col-lge {max-width: 73% !important; } } </style> </head> <body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;"> <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;"> <table role="presentation" style="width:100%;border:none;border-spacing:0;"> <tr> <td align="center" style="padding:0;"> <!--[if mso]> <table role="presentation" align="center" style="width:600px;"> <tr> <td> <![endif]--> <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;"> <tr> <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;"> <a href="http://www.example.com/" style="text-decoration:none;"><img src="https://server.visionvivante.com/cookreact/logo/book-your-cook-logo-white.png" width="165" alt="Logo" style="width:165px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;"></a> </td> </tr> <tr> <td style="padding:30px;background-color:#ffffff;"> <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">Welcome to Book Your cook !</h1> <p style="margin:0;">Thanks for register<br> <a href="'+BASE_URL+'verify/cook/'+user._id+'" target="_blank" style="color:#e50d70;text-decoration:underline;">Click Here</a> to Verify your email.</p> </td> </tr> <tr> <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;"> <p style="margin:0 0 8px 0;"><a href="http://www.facebook.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/facebook_1.png" width="40" height="40" alt="f" style="display:inline-block;color:#cccccc;"></a> <a href="http://www.twitter.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/twitter_1.png" width="40" height="40" alt="t" style="display:inline-block;color:#cccccc;"></a></p> <p style="margin:0;font-size:14px;line-height:20px;">&reg; Book Your Cook, 2022<br><a class="unsub" href="https://server.visionvivante.com/cookreact/" style="color:#cccccc;text-decoration:underline;">Subscribe instantly</a></p> </td> </tr> </table> <!--[if mso]> </td> </tr> </table> <![endif]--> </td> </tr> </table> </div> </body> </html>'
    };
    MAIL.mailTransporter.sendMail(mailDetails, function(err, data) {
    });

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

// Update cook
exports.update = async function(req, res) {
  // Our register logic starts here
  try {
    const { email, firstname, lastname, hourly_rate, about_me, pictures, lat, lng, languages, profession, country, state, city, zipcode, address, auto_location, speciality, dietary_preference, meal_type, cuisine_preference } = req.body;
    // if (!(firstname && lastname )) {
    //   return res.status(400).send({"status": false,'message': "All input is required"});
    // }
    var loca = { type: 'Point', coordinates: [] };
    

    var hourly_ratedata = Number(hourly_rate);
    const CookData = await Cook.findOne({ _id:  req.user.user_id});
    var isEmailUpdated = false;

    if(email){
      console.log('req.user.email');
      console.log(req.user.email);
      if(email != req.user.email){
        const oldUser = await User.findOne({ email });
        if (oldUser) {
          return res.status(409).send({"status": false,'message': "Email Already used by other user."});
        }
        const oldCook = await Cook.findOne({ email });
        if (oldCook) {
          return res.status(409).send({"status": false,'message': "Email Already used by other user."});
        }
        const user = await CookData.updateOne({
          email:email,
          is_verify: false
        });
        isEmailUpdated = true;
        let mailDetails = {
            from: MAIL_FROM,
            to: email,
            subject: 'Verify your email',
           // html: 'Thanks for register<br><a href="'+BASE_URL+'verify/user/'+user._id+'" target="_blank">Click here to Verify your email</a>'
           html: '<!DOCTYPE html> <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width,initial-scale=1"> <meta name="x-apple-disable-message-reformatting"> <title></title> <!--[if mso]> <style> table {border-collapse:collapse;border-spacing:0;border:none;margin:0;} div, td {padding:0;} div {margin:0 !important;} </style> <noscript> <xml> <o:OfficeDocumentSettings> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript> <![endif]--> <style> table, td, div, h1, p {font-family: Arial, sans-serif; } @media screen and (max-width: 530px) {.unsub {display: block; padding: 8px; margin-top: 14px; border-radius: 6px; background-color: #555555; text-decoration: none !important; font-weight: bold; } .col-lge {max-width: 100% !important; } } @media screen and (min-width: 531px) {.col-sml {max-width: 27% !important; } .col-lge {max-width: 73% !important; } } </style> </head> <body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;"> <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;"> <table role="presentation" style="width:100%;border:none;border-spacing:0;"> <tr> <td align="center" style="padding:0;"> <!--[if mso]> <table role="presentation" align="center" style="width:600px;"> <tr> <td> <![endif]--> <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;"> <tr> <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;"> <a href="http://www.example.com/" style="text-decoration:none;"><img src="https://server.visionvivante.com/cookreact/logo/book-your-cook-logo-white.png" width="165" alt="Logo" style="width:165px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;"></a> </td> </tr> <tr> <td style="padding:30px;background-color:#ffffff;"> <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">Welcome to Book Your cook !</h1> <p style="margin:0;">Thanks for registering<br> <a href="'+BASE_URL+'verify/cook/'+CookData._id+'" target="_blank" style="color:#e50d70;text-decoration:underline;">Click Here</a> to Verify your email.</p> </td> </tr> <tr> <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;"> <p style="margin:0 0 8px 0;"><a href="http://www.facebook.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/facebook_1.png" width="40" height="40" alt="f" style="display:inline-block;color:#cccccc;"></a> <a href="http://www.twitter.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/twitter_1.png" width="40" height="40" alt="t" style="display:inline-block;color:#cccccc;"></a></p> <p style="margin:0;font-size:14px;line-height:20px;">&reg; Book Your Cook, 2022<br><a class="unsub" href="https://server.visionvivante.com/cookreact/" style="color:#cccccc;text-decoration:underline;">Subscribe instantly</a></p> </td> </tr> </table> <!--[if mso]> </td> </tr> </table> <![endif]--> </td> </tr> </table> </div> </body> </html>'
        };
        MAIL.mailTransporter.sendMail(mailDetails, function(err, data) {
        });
      }
    }

    const user = await CookData.updateOne({
      firstname,
      lastname,
      hourly_rate : (!isNaN(hourly_ratedata))?hourly_ratedata:0,
      about_me,
      pictures,
      lat,
      lng,
      auto_location,
      //location:loca,
      languages,
      profession,
      country,
      state,
      city,
      zipcode,
      address,
      speciality, dietary_preference, meal_type, cuisine_preference
    });
    if(lat && lng){
      loca = { type: 'Point', coordinates: [lng, lat] };
        const user = await CookData.updateOne({
        
        location:loca,
        
      });
    }
    var newUserData = await Cook.findOne({ _id:  req.user.user_id}).lean().exec(); 
    newUserData.role = 'cook';
    res.status(201).json({"status": true, isEmailUpdated: isEmailUpdated, 'data': newUserData, 'message': "Updated Successfully"});
  } catch (err) {
    console.log(err);
  }
};

// Update cook picture
exports.uploadPictures = async function(req, res) {
  try {
    const CookData = await Cook.findOne({ _id:  req.user.user_id});
    const user = await CookData.updateOne({
      pictures: "cook/"+req.file.filename
    });
    var newUserData = await Cook.findOne({ _id:  req.user.user_id}).lean().exec(); 
    newUserData.role = 'cook';
    res.status(201).json({"status": true, 'data': newUserData, 'message': "Updated Successfully"});
  } catch (err) {
    console.log(err);
  }
};

// Update cook picture
exports.uploadCover = async function(req, res) {
  try {
    const CookData = await Cook.findOne({ _id:  req.user.user_id});
    const user = await CookData.updateOne({
      cover: "cookcover/"+req.file.filename
    });
    var newUserData = await Cook.findOne({ _id:  req.user.user_id}).lean().exec(); 
    newUserData.role = 'cook';
    res.status(201).json({"status": true, 'data': newUserData, 'message': "Updated Successfully"});
  } catch (err) {
    console.log(err);
  }
};