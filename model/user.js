// The User model
 
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var userSchema = new Schema({
  id: ObjectId,
  username: String,
  password: String,
  orgnizationId: ObjectId,
  createdDate: {type: Date, default: Date.now},
  createdBy: {type: ObjectId, default: ''}
});
 
module.exports = mongoose.model('User', userSchema);