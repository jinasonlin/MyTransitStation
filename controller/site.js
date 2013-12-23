exports.index = function(req, res) {
  if (global.client && global.client.userId) {
    res.redirect("/metadata/list");
  } else {
    res.render('site/index', {
      companyName: process.env.COMPANY_NAME || "ITBconsult",
      env: process.env.NODE_ENV || "development",
      username: process.env.TEMP_USERNAME || "",
      password: process.env.TEMP_PASSWORD || "",
      secureToken: process.env.TEMP_SECURETOKEN || "",
    });
  }
};