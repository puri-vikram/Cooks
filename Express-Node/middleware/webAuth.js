const session = require('express-session');

const config = process.env;

var webAuth = function(req, res, next) {
  //console.log(req);
  if (req.session && req.session.admin)
    return next();
  else
    return res.redirect('/login');
    return res.sendStatus(401);
};

module.exports = webAuth;