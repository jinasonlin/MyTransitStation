// The Organization model
 
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var organizationSchema = new Schema({
  name: String,
  description: String,
  defaultAdminUserId: ObjectId,
  createdDate: {type: Date, default: Date.now},
  createdBy: ObjectId
});
 
module.exports = mongoose.model('Organization', organizationSchema);