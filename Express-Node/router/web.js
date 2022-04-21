require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/webAuth");
const multer  = require('multer');

const router = new express.Router();

var loginController = require('../controllers/admin/loginController');
var dashboardController = require('../controllers/admin/dashboardController');
var userController = require('../controllers/admin/userController');
var cookController = require('../controllers/admin/cookController');
var reviewController = require('../controllers/admin/reviewController');

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

// Login view
router.get("/login", loginController.loginView);

// Login post
router.post("/login", loginController.login);

//logout
router.get('/logout', loginController.logout);

//Dashboard
router.get("/dashboard", auth, dashboardController.dashboardView);

//users listing
router.get("/users", auth, userController.listView);

//user delete
router.get("/user/delete/:id", auth, userController.delete);

//user edit
router.get("/user/edit/:id", auth, userController.editView);

//user add
router.get("/user/add", auth, userController.addView);

//user add
router.post("/user/add", auth, uploadUser.single('pictures'), userController.add);

//user update
router.post("/user/edit/:id", auth, uploadUser.single('pictures'), userController.edit);

//user update password
router.post("/user/update/password/:id", auth, userController.passwordUpdate);

//cook listing
router.get("/cooks", auth, cookController.list);

//cook edit
router.get("/cook/edit/:id", auth, cookController.editView);

//cook add
router.get("/cook/add", auth, cookController.addView);

//cook add
router.post("/cook/add", auth, uploadCook.single('pictures'), cookController.add);

//cook update
router.post("/cook/edit/:id", auth, uploadCook.single('pictures'), cookController.update);

//user update password
router.post("/cook/update/password/:id", auth, cookController.passwordUpdate);

//cook delete
router.get("/cook/delete/:id", auth, cookController.delete);

//cook recipe update
router.post("/cook/update/recipe/:id", cookController.RecipeUpdate);

//cook recipe delete
router.get("/cook/delete/recipe/:id", auth, cookController.RecipeDelete);

//cook recipe delete
router.get("/review/delete/:id", auth, reviewController.delete);

//cook edit
router.get("/review/edit/:id", auth, reviewController.editView);

//cook edit
router.post("/review/updatedata/:id", auth, reviewController.update);


//cook listing
router.get("/reviews", auth, reviewController.list);

router.get("/", auth, async (req, res) => {
  res.redirect('/dashboard');
});

module.exports = router;