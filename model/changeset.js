var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , Archive = require('./archive')
  , Validation = require('./validation')
  , Deployment = require('./deployment');
 
var ChangeSet = new Schema({
  name: {type :String,default : ''},
  description: {type :String,default : ''},
  createdDate: {type: Date, default: Date.now},
  createdBy: {type: ObjectId, default: null},
  sfconnId: {type: ObjectId, default: null},
  files : {type : Array, default : []},
  archiveStatus : {type : String , default : 'none'},
  validateStatus : {type : String , default : 'none'},
  deployStatus : {type : String , default : 'none'}
});

module.exports = mongoose.model('ChangeSet', ChangeSet);