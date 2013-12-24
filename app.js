var express = require("express")
  , logfmt = require("logfmt")
  , app = express()
  , authentication = require("./filter/authentication")
  , site = require('./controller/site')
  , user = require('./controller/user')
  , metadata = require('./controller/metadata');

app.use(logfmt.requestLogger());
app.set("view engine", "jade");
app.set("view options", {layout: true});
app.set("views", __dirname + "/views");
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
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


app.get("/", authentication.redirectIfLoggedIn, site.index);
app.get("/user/login", authentication.redirectIfLoggedIn, user.login);

app.all("/metadata/*", authentication.checkLogin);
app.get("/metadata/list", metadata.list);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});