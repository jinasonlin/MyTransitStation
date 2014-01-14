var express = require("express")
  , mongoose = require('mongoose')
  , MongoStore = require('connect-mongo')(express)
  , logfmt = require("logfmt")
  , app = express();

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/migrationtool';

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + uristring);
  }
});

app.use(logfmt.requestLogger());
app.set("view engine", "jade");
app.set("view options", {layout: true});
app.set("views", __dirname + "/views");
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.session({
  secret: "abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()",
  store: new MongoStore({
    url: uristring,
    auto_reconnect: true
  }),
  cookie: {path: '/', maxAge: null}
}));
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next();
});

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

var route = require("./route");
route(app);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});