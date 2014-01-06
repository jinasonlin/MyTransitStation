var authentication = require("./filter/user-authentication")
  , site = require('./controller/site')
  , metadata = require('./controller/metadata')
  , admin = require('./controller/admin');

module.exports = function(app) {
  //app.get("/", authentication.redirectIfLoggedIn, site.index);
  var user = require('./controller/user')

  app.get("/", user.showloginForm);
  app.get("/user/login", user.login);

  /*
  app.get("/admin", user.showAdminLoginForm);
  app.get("/admin/login", user.adminLogin);

  app.all("/metadata/*", authentication.checkLogin);
  app.get("/metadata/list", metadata.list);

  app.get("/organization/new", user.initOrganizationForm);
  app.post("/organization", user.saveOrganization);
  */
}