require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer  = require('multer');
//const upload = multer({ dest: 'public/cook/' });

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/cook/')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
  }
})
const uploadCook = multer({ storage: storage });

let storageCover = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/cookcover/')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
  }
})
const uploadCookCover = multer({ storage: storageCover });


let storageuser = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/user/')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
  }
})
const uploadUser = multer({ storage: storageuser });


let storagerecipe = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/recipe/')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
  }
})
const uploadRecipeImages = multer({ storage: storagerecipe });

const app = express();

app.use(express.json());
const router = new express.Router();

var loginController = require('../controllers/api/loginController');
var userController = require('../controllers/api/userController');
var cookController = require('../controllers/api/cookController');
var recipeController = require('../controllers/api/recipeController');
var reviewController = require('../controllers/api/reviewController');
var contactController = require('../controllers/api/contactController');
var messageController = require('../controllers/api/messageController');
var preferenceController = require('../controllers/api/preferenceController');
var eventHandler = require('../controllers/events/eventHandler');


// Login
router.post("/api/login", loginController.login);

// refresh token
router.post("/api/refresh/token", auth, loginController.refresh);

// verify cook
router.get("/verify/cook/:id", loginController.verifyCookEmail);

// verify user
router.get("/verify/user/:id", loginController.verifyUserEmail);

// Forgot Password
router.post("/api/forgot/password", loginController.forgotPassword);

// Reset Password
router.post("/api/reset/password", loginController.resetPassword);

// Reset Password
router.post("/api/update/password", auth, loginController.updatePassword);

// Register user
router.post("/api/register/user", userController.register);

// Update user
router.post("/api/update/user", auth, userController.update);

// Update user
router.post("/api/contact-us", contactController.contactUs);

//Upload user picture
router.post("/api/upload/user/picture", auth, uploadUser.single('picture'), userController.uploadPictures);

// Register cook
router.post("/api/register/cook", cookController.register);

// Update cook
router.post("/api/update/cook", auth, cookController.update);

//List of cooks
router.get("/api/cooks/list", cookController.list);

//List of cooks
router.post("/api/cook/search", cookController.search);

//Cooks detail
router.get("/api/cook/detail/:id", auth, cookController.detail); 

//Cooks reviews
router.get("/api/cook/reviews/:id", cookController.reviews);

//Upload Cook picture
router.post("/api/upload/cook/picture", auth, uploadCook.single('picture'), cookController.uploadPictures);

//Upload Cook cover
router.post("/api/upload/cook/cover", auth, uploadCookCover.single('cover'), cookController.uploadCover);

// List recipe
router.get("/api/recipe/list", recipeController.list);

// List recipe
router.get("/api/recipe/detail/:id", recipeController.detail);

// List recipe for cook
router.get("/api/cookrecipe/list", auth, recipeController.cooklist);

// add recipe
router.post("/api/add/recipe", auth, recipeController.add);

// update recipe
router.post("/api/update/recipe/:id", auth, recipeController.update);

// delete recipe
router.delete("/api/delete/recipe/:id", auth, recipeController.delete);

//Upload recipe images
router.post("/api/upload/recipe/images/:id", auth, uploadRecipeImages.array('images'), recipeController.uploadImages);

// add recipe type
router.post("/api/add/recipe/type", auth, recipeController.addRecipeType);

// add review 
router.post("/api/add/review", auth, reviewController.add);

// edit review 
router.post("/api/edit/review/:id", auth, reviewController.edit);

// add reply 
router.post("/api/add/review/reply/:id", auth, reviewController.reply);

// delete reply 
router.delete("/api/delete/review/reply/:id", auth, reviewController.deletereply);

// delete review
router.delete("/api/delete/review/:id", auth, reviewController.delete);

// send message
router.post("/api/send/message", auth, messageController.send);

// send message
router.post("/api/mark/read/message", auth, messageController.markasread);

// send message
router.get("/api/unread/message/count", auth, messageController.unreadmessagecount);

// get all chat users
router.get("/api/get/allchatusers", auth, messageController.allchatusers);

// all message
router.get("/api/get/allmessage/:id", auth, messageController.allmessage);

// Featured chefs and cooks
router.get("/api/get/featuredchefsandcooks", cookController.featuredchefsandcooks);

//for search preference
router.post("/api/search/preference", preferenceController.search);

//preference suggestion
router.post("/api/preference/suggestion", preferenceController.suggestion);

router.get('/events/:id', eventHandler.init)

module.exports = router;