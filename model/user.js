// The User model
 
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: String,
  email: String,
  type: {type: String, required: true},
  firstname: String,
  lastname: String,
  orgnizationId: ObjectId,
  createdDate: {type: Date, default: Date.now},
  createdBy: ObjectId
});

userSchema.statics.isAdmin = function(user) {
  return user.type == User.SUPER_ADMIN || user.type == User.ORG_ADMIN;
}

userSchema.statics.isSuperAdmin = function(user) {
  return user.type == User.SUPER_ADMIN;
}

userSchema.statics.isOrgAdmin = function(user) {
  return user.type == User.ORG_ADMIN;
}

userSchema.statics.isOrgUser = function(user) {
  return user.type == User.ORG_USER;
}

var User = mongoose.model('User', userSchema);
User.SUPER_ADMIN = "superadmin";
User.ORG_ADMIN = "orgadmin";
User.ORG_USER = "orguser";
module.exports = User;

// Initialize super admin user
User.findOne({username: "superadmin"}, function (err, user) {
  if (user == null) {
    // not found, initialize a new one
    var user = new User({
      username: "superadmin",
      password: "3dc1a0155b33086998b57cd72b2ba3ecaa65f4faf0a8869d7930ea9fafaf403f", 
      email: 'haobo.song@itbconsult.com',
      firstname: "Haobo",
      lastname: "Song",
      type: User.SUPER_ADMIN
    }).save(function (err, user) {
      if (err) {
        console.log("failed to initialize super admin", err);
      } else {
        console.log("super admin initialized successfully");
      }
    });
  }
});


