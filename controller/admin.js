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
          res.redirect('/admin/organization/' + user.organizationId);
        } else {
          res.redirect('/admin/organization/' + user.organizationId);
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
  var id = req.params.id;
  Organization.findById(id, function (err, org) {
    if (err) {
      res.redirect('/admin/organization');
    } else {
      User.find({organizationId: id}, function(err, users) {
        console.log("found users: " + users);
        res.render('admin/organization/view', {org: org, users: users});
      });      
    }
  });
};

exports.editOrganization = function(req, res) {
  console.log("edit org");
  var id = req.params.id;
  if (id) {
    // edit
    Organization.findById(id, function (err, org) {
      if (err) {
        res.redirect('/admin/organization');
      } else {
        res.render('admin/organization/edit', {org: org});
      }
    });
  } else {
    // new
    res.render('admin/organization/edit');
  }
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
        organizationId: org._id,
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
              res.send({success: true});
            }
          });
        }
      });
    }
  });
};

exports.updateOrganization = function(req, res) {
  console.log("update org");
  Organization.findByIdAndUpdate(req.param("id"), {
    name: req.param("name", ""),
    description: req.param("description", "")
  }, function(err, org) {
    if (err) {
      console.log("failed to update org", err);
    } else {
      console.log("org updated");
      res.send({success: true});
    }
  })
};

exports.deleteOrganization = function(req, res) {
  console.log("delete org");
  var id = req.params.id;
  User.remove({organizationId: id}, function(err) {
    if (err) {
      console.log("failed to remove organization users");
    } else {
      console.log("organization users removed");
      Organization.findByIdAndRemove(id, function(err, org) {
        if (err) {
          console.log("failed to delete org " + org._id);
        } else {
          console.log("delete org " + org._id + " successfully");
          res.send({success: true});
        }
      });
    }
  });
};

exports.editOrganizationUser = function(req, res) {
  console.log("edit org user");
  var orgId = req.params.orgId;
  var userId = req.params.userId;
  if (userId) {
    // edit
    console.log("edit form");
    User.findOne({organizationId: orgId, _id: userId}, function (err, user) {
      if (err) {
        res.redirect('/admin/organization/' + orgId);
      } else {
        res.render('admin/user/edit', {user: user});
      }
    });
  } else {
    // new
    console.log("new form");
    res.render('admin/user/edit');
  }
};

exports.viewOrganizationUser = function(req, res) {
  console.log("view org user");
  var orgId = req.params.orgId;
  var userId = req.params.userId;
  User.findOne({organizationId: orgId, _id: userId}, function (err, user) {
    if (err) {
      res.redirect('/admin/organization/' + orgId);
    } else {
      console.log("found user: " + user);
      res.render('admin/user/view', {user: user});    
    }
  });
};

exports.createOrganizationUser = function(req, res) {

};

exports.updateOrganizationUser = function(req, res) {

};

exports.deleteOrganizationUser = function(req, res) {
  console.log("delete org user");
  var orgId = req.params.orgId;
  var userId = req.params.userId;
  User.remove({organizationId: orgId, _id: userId}, function(err) {
    if (err) {
      console.log("failed to remove organization user");
    } else {
      console.log("organization user removed");
      res.send({success: true});
    }
  });
};