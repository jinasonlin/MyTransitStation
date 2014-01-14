var userAuthFilter = require("./filter/userAuthFilter")
  , user = require('./controller/user')
  , sfconnManager = require("./controller/sfconnManager")
  , changeSetManager = require("./controller/changeSetManager")
  , adminAuthFilter = require("./filter/adminAuthFilter")
  , admin = require('./controller/admin')
  , test = require('./controller/test');

module.exports = function(app) {
  // user login
  app.get("/", userAuthFilter.redirectToHomePageIfAlreadyLoggedIn, user.showloginForm);
  app.get("/user/login", userAuthFilter.redirectToHomePageIfAlreadyLoggedIn, user.login);
  app.get("/user/logout", user.logout);

  //sfconn manage routes
  app.all(/^\/sfconn(\w)*/, userAuthFilter.checkLogin);
  app.get("/sfconn",sfconnManager.listSFConn);
  app.post("/sfconn",sfconnManager.addSFConn);
  app.post("/sfconn/validate",sfconnManager.validateSFConn);
  app.get("/sfconn/logout",sfconnManager.logoutSFConn);
  app.get("/sfconn/:sfconnId",sfconnManager.listSFConnInfo);
  app.put("/sfconn/:sfconnId",sfconnManager.updateSFConn);
  app.delete("/sfconn/:sfconnId",sfconnManager.deleteSFConn);
  
  app.post("/sfconn/:sfconnId/syncFile",sfconnManager.syncFile);
  app.all("/sfconn/:sfconnId/*",userAuthFilter.checkSFConnLoggedin);
  app.get("/sfconn/:sfconnId/changeSets",sfconnManager.changeSetInit);
  app.post("/sfconn/:sfconnId/changeSets",sfconnManager.changeSetSave);
  app.get("/sfconn/:sfconnId/changeSets/:changeSetId",sfconnManager.changeSetInfo);
  app.delete("/sfconn/:sfconnId/changeSets/:changeSetId",sfconnManager.changeSetDelete);

  // todo: determine if these still need, if not we then remove them
  app.post("/changeSets/:changeSetId/archives",changeSetManager.addArchive);
  app.post("/changeSets/:changeSetId/validate",changeSetManager.addValidation);
  app.post("/changeSets/:changeSetId/deploy",changeSetManager.addDeployment);

  app.get("/test",test.testDeploy);

  // admin login
  app.get("/admin", adminAuthFilter.redirectToHomePageIfAlreadyLoggedIn, admin.showloginForm);
  app.get("/admin/login", adminAuthFilter.redirectToHomePageIfAlreadyLoggedIn, admin.login);
  app.get("/admin/logout", admin.logout);

  app.all(/^\/admin\/organization(\w)*/, adminAuthFilter.checkLogin);
  app.get("/admin/organization", adminAuthFilter.checkLoginOfSuperAdmin, admin.listOrganization);
  app.get("/admin/organization/new", adminAuthFilter.checkLoginOfSuperAdmin, admin.editOrganization);
  app.get("/admin/organization/:id", adminAuthFilter.checkLoginOfSuperAdmin, admin.viewOrganization);
  app.get("/admin/organization/:id/edit", adminAuthFilter.checkLoginOfSuperAdmin, admin.editOrganization);
  app.post("/admin/organization", adminAuthFilter.checkLoginOfSuperAdmin, admin.createOrganization);
  app.put("/admin/organization/:id", adminAuthFilter.checkLoginOfSuperAdmin, admin.updateOrganization);
  app.delete("/admin/organization/:id", adminAuthFilter.checkLoginOfSuperAdmin, admin.deleteOrganization);

  app.get("/admin/organization/user", function(req, res) {res.send(200)});
}