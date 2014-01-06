// The SFConnection model
 
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var SFConnection = new Schema({
  name: String,
  username : String,
  password : String,
  secureToken : String,
  conn_env : {type:String,default:'test.salesforce.com'},
  description: String,
  createdDate: {type: Date, default: Date.now},
  createdBy: {type: ObjectId, default: null}
});
 
module.exports = mongoose.model('SFConnection', SFConnection);