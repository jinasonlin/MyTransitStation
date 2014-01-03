var authentication = require("./filter/authentication")
  , site = require('./controller/site')
  , user = require('./controller/user')
  , metadata = require('./controller/metadata');

module.exports = function(app) {
  app.get("/", authentication.redirectIfLoggedIn, site.index);
  app.get("/user/login", authentication.redirectIfLoggedIn, user.login);

  app.all("/metadata/*", authentication.checkLogin);
  app.get("/metadata/list", metadata.list);

  app.get("/organization/new", user.initOrganizationForm);
  app.post("/organization", user.saveOrganization);
}