var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Welcome to Salesforce Migration Tool! (' + (process.env.COMPANY_NAME || "ITBconsult") + " - " + (process.env.NODE_EVN || "development") + ")");
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

app.configure('production', function() {
  // Do production-specific action
  console.log("running on production");
});
app.configure('staging', function() {
  // Do staging-specific action
  console.log("running on staging");
});
app.configure('development', function() {
  // Do some development-specific action
  console.log("running on development");
});