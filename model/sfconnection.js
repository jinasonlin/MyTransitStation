// The SFConnection model
 
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var SFConnection = new Schema({
  name: {type :String,default : ''},
  username : {type :String,default : ''},
  password : {type :String,default : ''},
  secureToken : {type :String,default : ''},
  conn_env : {type:String,default:'test.salesforce.com'},
  description: {type :String,default : ''},
  createdDate: {type: Date, default: Date.now},
  createdBy: {type: ObjectId, default: null},
  fileInfo : {type : Array, default : []},
  syncFileStatus : {type : String, default : 'none'},
  lastFileSyncDate : {type : Date , default : null},
  sfconntype : {type:String,default:'normal'} //normal(can query)  temp(will be delete)
});
 
module.exports = mongoose.model('SFConnection', SFConnection);