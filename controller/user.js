var nodeforce = require("../lib/nodeforce");
var Organization = require('../model/organization');
var User = require('../model/user');

exports.showloginForm = function(req, res) {
  console.log("aaa");
  res.render('user/login-form');
};

exports.login = function(req, res) {
  User.findOne({
    username: req.body.username,
    password: req.body.password
  }, function (err, user) {
    console.log("login with " + req.body.username + ": " + user);
    if (user != null) {
      // found valid user
      req.session.user = user;
      req.session.save(function(err) {
        res.redirect('/sfconn');
      });
    } else {
      res.redirect('/');
    }
  });
};

/*
exports.login = function(req, res) {
  global.client = nodeforce.createClient({
    username: req.body.username,
    password: req.body.password + req.body.secureToken,
    endpoint: req.body.endpoint
  });
  global.client.login(function(err, response, lastRequest) {
    if (global.client.userId) {
      res.redirect("/metadata/list");
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