var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());
app.set("view engine", "jade");
app.set("view options", {layout: true});
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + '/public'));

app.configure("production", function() {
  // Do some production-specific action
  console.log("running on production");
});
app.configure("staging", function() {
  // Do some staging-specific action
  console.log("running on staging");
});
app.configure("development", function() {
  // Do some development-specific action
  console.log("running on development");
});

app.get("/", function(req, res) {
  res.render("index", {companyName: process.env.COMPANY_NAME || "ITBconsult", env: process.env.NODE_ENV || "development"});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

