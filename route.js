var authentication = require("./filter/user-authentication")
  , site = require('./controller/site')
  , user = require('./controller/user')
  , metadata = require('./controller/metadata')
  , sfconnManager = require("./controller/sfconnManager")
  , admin = require('./controller/admin');

module.exports = function(app) {
  //app.get("/", authentication.redirectIfLoggedIn, site.index);
  var user = require('./controller/user')

  app.get("/", user.showloginForm);
  app.get("/user/login", user.login);

  //sfconn manage routes
  app.get("/sfconn",sfconnManager.listSFConn);
  app.post("/sfconn",sfconnManager.addSFConn);
  app.post("/sfconn/validate",sfconnManager.validateSFConn);
  app.get("/sfconn/logout",sfconnManager.logoutSFConn);
  app.get("/sfconn/:sfconnId",sfconnManager.listSFConnInfo);
  app.put("/sfconn/:sfconnId",sfconnManager.updateSFConn);
  app.delete("/sfconn/:sfconnId",sfconnManager.deleteSFConn);
  
  app.all("/sfconn/:sfconnId/*",authentication.checkSFConnLoggedin);
  app.get("/sfconn/:sfconnId/changeSets",sfconnManager.changeSetInit);
  app.post("/sfconn/:sfconnId/changeSets",sfconnManager.changeSetNew);
  app.get("/sfconn/:sfconnId/changeSets/:changeSetId",sfconnManager.changeSetInfo);
  app.put("/sfconn/:sfconnId/changeSets/:changeSetId",sfconnManager.changeSetEdit);
  app.delete("/sfconn/:sfconnId/changeSets/:changeSetId",sfconnManager.changeSetDelete);

  /*
  app.get("/admin", user.showAdminLoginForm);
  app.get("/admin/login", user.adminLogin);

  app.all("/metadata/*", authentication.checkLogin);
  app.get("/metadata/list", metadata.list);

  app.get("/organization/new", user.initOrganizationForm);
  app.post("/organization", user.saveOrganization);
  */
}