var User = require('../model/user')
  , encrypService = require("../service/encrypservice");

exports.showloginForm = function(req, res) {
  res.render('user/login-form');
};

exports.login = function(req, res) {
  User.findOne({
    username: req.param("username", ""),
    password: encrypService.generateHashPassword(req.param("password", ""))
  }, function (err, user) {
    if (user != null) {
      // found valid user
      console.log("user[" + user.username + "] logged in successfully");
      req.session.user = user;
      req.session.save(function(err) {
        res.redirect('/sfconn');
      });
    } else {
      res.redirect('/');
    }
  });
};

exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
};

/*
var nodeforce = require("../lib/nodeforce");
exports.login = function(req, res) {
  global.client = nodeforce.createClient({
    username: req.body.username,
    password: req.body.password + req.body.secureToken,
    endpoint: req.body.endpoint
  });
  global.client.login(function(err, response, lastRequest) {
    if (global.client.userId) {
      res.redirect("/sfconn/list");
    } else {
      res.redirect("/?errMessage=Login failed, please check your username and password!");
    }
  });
};

exports.initOrganizationForm = function(req, res) {
  res.render('user/organizationform');
}

exports.saveOrganization = function(req, res) {
  var org = new Organization({
    name: req.body.name, 
    description: req.body.description
  }).save(function (err, org) {
    res.send("new org saved: " + org);
  });
  var user = new User({
    username: 'superadmin',
    password: 'superadmin1', 
    email: 'lingjun.jiang@itbconsult.com',
    type: 'superadmin',
  }).save(function (err, user) {
    res.send("new user saved: " + user);
  });
  */
