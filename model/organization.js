// The Organization model
 
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var organizationSchema = new Schema({
  name: String,
  description: String,
  defaultAdminUserId: {type: ObjectId, default: null},
  createdDate: {type: Date, default: Date.now},
  createdBy: {type: ObjectId, default: null}
});
 
module.exports = mongoose.model('Organization', organizationSchema);