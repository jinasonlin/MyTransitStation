// The User model
 
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  type: String,
  orgnizationId: ObjectId,
  createdDate: {type: Date, default: Date.now},
  createdBy: ObjectId
});
 
module.exports = mongoose.model('User', userSchema);