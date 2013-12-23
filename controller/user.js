var nodeforce = require("../lib/nodeforce");

exports.login = function(req, res) {
  if (global.client && global.client.userId) {
    res.redirect("/metadata/list");
  } else {
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
  }
};