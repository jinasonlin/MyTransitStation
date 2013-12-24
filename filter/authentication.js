exports.checkLogin = function(req, res, next) {
  if (global.client && global.client.userId) {
    next();
  } else {
    res.redirect('/');
  }
};

exports.redirectIfLoggedIn = function(req, res, next) {
  if (global.client && global.client.userId) {
    res.redirect('/metadata/list');
  } else {
    next();
  }
};