var nodeforce = require("../lib/nodeforce");
var Organization = require('../model/organization');

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
}