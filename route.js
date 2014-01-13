var authentication = require("./filter/user-authentication")
  , site = require('./controller/site')
  , user = require('./controller/user')
  , metadata = require('./controller/metadata')
  , sfconnManager = require("./controller/sfconnManager")
  , changeSetManager = require("./controller/changeSetManager")
  , admin = require('./controller/admin')
  , test = require('./controller/test');

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
  
  app.post("/sfconn/:sfconnId/syncFile",sfconnManager.syncFile);
  app.all("/sfconn/:sfconnId/*",authentication.checkSFConnLoggedin);
  app.get("/sfconn/:sfconnId/changeSets",sfconnManager.changeSetInit);
  app.post("/sfconn/:sfconnId/changeSets",sfconnManager.changeSetSave);
  app.get("/sfconn/:sfconnId/changeSets/:changeSetId",sfconnManager.changeSetInfo);
  app.delete("/sfconn/:sfconnId/changeSets/:changeSetId",sfconnManager.changeSetDelete);

  app.post("/changeSets/:changeSetId/archives",changeSetManager.addArchive);
  app.post("/changeSets/:changeSetId/validate",changeSetManager.addValidation);
  app.post("/changeSets/:changeSetId/deploy",changeSetManager.addDeployment);

  app.get("/test",test.testDeploy);

  /*
  app.get("/admin", user.showAdminLoginForm);
  app.get("/admin/login", user.adminLogin);

  app.all("/metadata/*", authentication.checkLogin);
  app.get("/metadata/list", metadata.list);

  app.get("/organization/new", user.initOrganizationForm);
  app.post("/organization", user.saveOrganization);
  */
}