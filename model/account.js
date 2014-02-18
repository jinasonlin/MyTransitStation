// The SFConnection model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var Account = new Schema({
  name: {type : String, default : ''},
  userEmail: {type : String, default : ''},
  sid : {type : String, default : ''},
  userId : {type : String, default : ''},
  endpoint : {type : String, default : ''},
  createdDate: {type: Date, default: Date.now},
  createdBy: {type: ObjectId, default : null},
  fileInfo : {type : Array, default : []},
  syncFileStatus : {type : String, default : 'none'},
  lastFileSyncDate : {type : Date, default : null},
  accountType : {type: String, default : 'normal'} //normal(can query)  temp(will be delete)
});

module.exports = mongoose.model('Account', Account);