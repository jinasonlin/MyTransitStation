var Organization = require('../model/organization')
  , User = require('../model/user')
  , encrypService = require("../service/encrypservice");

exports.showloginForm = function(req, res) {
  res.render('admin/login-form');
};

exports.login = function(req, res) {
  User.findOne({
    username: req.param("username", ""),
    password: encrypService.generateHashPassword(req.param("password", ""))
  }, function (err, user) {
    if (user != null && User.isAdmin(user)) {
      // found valid user
      console.log("user[" + user.username + "], admin user is " + User.isAdmin(user) + ", logged in successfully");
      req.session.user = user;
      req.session.save(function(err) {
        if (User.isSuperAdmin(user)) {
          res.redirect('/admin/organization');
        } else if (User.isOrgAdmin(user)) {
          res.redirect('/admin/organization/user');
        } else {
          res.redirect('/admin/organization/user');
        }
      });
    } else {
      res.redirect('/admin');
    }
  });
};

exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/admin');
  });
};

exports.listOrganization = function(req, res) {
  console.log("list org");
  Organization.find({}, function (err, orgs) {
    res.render('admin/organization/list', {orgs: orgs});
  });
};

exports.viewOrganization = function(req, res) {
  console.log("view org");
  res.render('admin/organization/view');
};

exports.editOrganization = function(req, res) {
  console.log("edit org");
  res.render('admin/organization/edit');
};

exports.createOrganization = function(req, res) {
  console.log("create org");
  var org = new Organization({
    name: req.param("name", ""),
    description: req.param("description", ""),
    createdBy: req.session.user._id
  }).save(function (err, org) {
    if (err) {
      console.log("failed to create org", err);
    } else {
      console.log("org created");
      // todo: need to check if user already exists
      var user = new User({
        username: org.name + "admin",
        password: encrypService.generateHashPassword(org.name + "admin"), 
        type: User.ORG_ADMIN,
        orgnizationId: org._id,
        createdBy: req.session.user._id
      }).save(function (err, user) {
        if (err) {
          console.log("failed to initialize org admin", err);
        } else {
          console.log("org admin initialized successfully");
          org.defaultAdminUserId = user._id;
          org.save(function(err, org) {
            if (err) {
              console.log("failed to set default org admin id");
            } else {
              console.log("set default org admin successfully");
              res.redirect('/admin/organization');
            }
          });
        }
      });
    }
  });
};

exports.updateOrganization = function(req, res) {
  console.log("update org");
  res.render('admin/organization/list');
};

exports.deleteOrganization = function(req, res) {
  console.log("delete org");
  var id = req.params.id;
  Organization.findByIdAndRemove(id, function(err, org) {
    if (err) {
      console.log("failed to delete org " + org._id);
    } else {
      console.log("delete org " + org._id + " successfully");
      res.send({success: true});
    }
  });
};