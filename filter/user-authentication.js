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

exports.checkSFConnLoggedin = function(req,res,next){
  var sfconnId = req.params.sfconnId;
  if(global.sfclient && global.sfclient.userId){
    next();
  }else{
    res.redirect("/sfconn/");
  }
};