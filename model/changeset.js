var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var ChangeSet = new Schema({
  name: {type :String,default : ''},
  description: {type :String,default : ''},
  createdDate: {type: Date, default: Date.now},
  createdBy: {type: ObjectId, default: null},
  sfconnId: {type: ObjectId, default: null},
  files : {type : Array, default : []},
  historyLog : {type : String , default : ''}
});
 
module.exports = mongoose.model('ChangeSet', ChangeSet);