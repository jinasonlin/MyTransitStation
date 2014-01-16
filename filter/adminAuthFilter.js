var User = require('../model/user');

exports.checkLogin = function(req, res, next) {
  if (req.session.user != null && User.isAdmin(req.session.user)) {
    // admin user already logged in
    next();
  } else {
    // redirect to login page
    res.redirect('/admin');
  }
};

exports.checkLoginOfSuperAdmin = function(req, res, next) {
  if (req.session.user != null && User.isSuperAdmin(req.session.user)) {
    // super admin user already logged in
    next();
  } else if (req.session.user != null && User.isOrgAdmin(req.session.user)) {
    // redirect to organization home page
    res.redirect('/admin/organization/' + req.session.user.organizationId);
  } else {
    // redirect to login page
    res.redirect('/admin');
  }
};

exports.checkLoginOfOrgAdmin = function(req, res, next) {
  if (req.session.user != null && User.isSuperAdmin(req.session.user)) {
    // super admin user already logged in
    next();
  } else if (req.session.user != null && User.isOrgAdmin(req.session.user)) {
    // redirect to organization home page
    var orgId = req.params.orgId;
    if (orgId == null) orgId = req.params.id;
    if (orgId == null) {
      res.send(404);
    } else {
      if (orgId != req.session.user.organizationId) {
        // not the org admin of this org
        res.redirect('/admin/organization/' + req.session.user.organizationId);
      } else {
        next();
      }
    }
  } else {
    // redirect to login page
    res.redirect('/admin');
  }
};

exports.redirectToHomePageIfAlreadyLoggedIn = function(req, res, next) {
  if (req.session.user != null && User.isAdmin(req.session.user)) {
    // admin user already logged in, redirect to home page
    if (User.isSuperAdmin(req.session.user)) {
      res.redirect('/admin/organization');
    } else if (User.isOrgAdmin(req.session.user)) {
      res.redirect('/admin/organization/' + req.session.user.organizationId);
    } else {
      res.redirect('/admin/organization/' + req.session.user.organizationId);
    }
  } else {
    // continue login process
    next();
  }
};