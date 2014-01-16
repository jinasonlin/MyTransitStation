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

  
  app.all(/^\/changeSet(\w)*/, userAuthFilter.checkLogin);
  // todo: determine if these still need, if not we then remove them
  app.post("/changeSets/:changeSetId/archives",changeSetManager.addArchive);

  //app.get("/changeSet/archive/:archiveId",changeSetManager.viewArchive);
  app.delete("/changeSet/archive/:archiveId",changeSetManager.deleteArchive);
  //app.get("/changeSet/validation/:validationId",changeSetManager.viewValidation);
  app.delete("/changeSet/validation/:validationId",changeSetManager.deleteValidation);
  //app.get("/changeSet/deployment/:deploymentId",changeSetManager.viewDeployment);
  app.delete("/changeSet/deployment/:deploymentId",changeSetManager.deleteDeployment);

  app.get("/test",test.testDeploy);

  // admin login
  app.get("/admin", adminAuthFilter.redirectToHomePageIfAlreadyLoggedIn, admin.showloginForm);
  app.get("/admin/login", adminAuthFilter.redirectToHomePageIfAlreadyLoggedIn, admin.login);
  app.get("/admin/logout", admin.logout);

  app.all(/^\/admin\/organization(\w)*/, adminAuthFilter.checkLogin);
  app.get("/admin/organization", adminAuthFilter.checkLoginOfSuperAdmin, admin.listOrganization);
  app.get("/admin/organization/new", adminAuthFilter.checkLoginOfSuperAdmin, admin.editOrganization);
  app.get("/admin/organization/:id", adminAuthFilter.checkLoginOfOrgAdmin, admin.viewOrganization);
  app.get("/admin/organization/:id/edit", adminAuthFilter.checkLoginOfSuperAdmin, admin.editOrganization);
  app.post("/admin/organization", adminAuthFilter.checkLoginOfSuperAdmin, admin.createOrganization);
  app.put("/admin/organization/:id", adminAuthFilter.checkLoginOfSuperAdmin, admin.updateOrganization);
  app.delete("/admin/organization/:id", adminAuthFilter.checkLoginOfSuperAdmin, admin.deleteOrganization);

  app.get("/admin/organization/:orgId/user/new", adminAuthFilter.checkLoginOfOrgAdmin, admin.editOrganizationUser);
  app.get("/admin/organization/:orgId/user/:userId", adminAuthFilter.checkLoginOfOrgAdmin, admin.viewOrganizationUser);
  app.get("/admin/organization/:orgId/user/:userId/edit", adminAuthFilter.checkLoginOfOrgAdmin, admin.editOrganizationUser);
  app.post("/admin/organization/:orgId/user", adminAuthFilter.checkLoginOfOrgAdmin, admin.createOrganizationUser);
  app.put("/admin/organization/:orgId/user/:userId", adminAuthFilter.checkLoginOfOrgAdmin, admin.updateOrganizationUser);
  app.delete("/admin/organization/:orgId/user/:userId", adminAuthFilter.checkLoginOfOrgAdmin, admin.deleteOrganizationUser);
}