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
  } else {
    // redirect to login page
    res.redirect('/admin/organization/user');
  }
};

exports.redirectToHomePageIfAlreadyLoggedIn = function(req, res, next) {
  if (req.session.user != null && User.isAdmin(req.session.user)) {
    // admin user already logged in, redirect to home page
    if (User.isSuperAdmin(req.session.user)) {
      res.redirect('/admin/organization');
    } else if (User.isOrgAdmin(req.session.user)) {
      res.redirect('/admin/organization/user');
    } else {
      res.redirect('/admin/organization/user');
    }
  } else {
    // continue login process
    next();
  }
};