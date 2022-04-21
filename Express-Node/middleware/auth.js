const jwt = require("jsonwebtoken");

const config = process.env;
const User = require("../model/user");
const Cook = require("../model/cook");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({"status": false,'message': "A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;

    var user = await Cook.findOne({ _id: req.user.user_id });
    if(!user) {
      user = await User.findOne({ _id: req.user.user_id });  
    }
    if(!user){
      return res.status(401).send({"status": false,'message': "Not a valid user"});
    }
  } catch (err) {
    return res.status(401).send({"status": false,'message': "Invalid Token"});
  }
  return next();
};

module.exports = verifyToken;