var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var Archive = new Schema({
  name : String ,
  createdDate: {type: Date, default: Date.now},
  changeSetId: {type: ObjectId, default: null},
  createdBy: {type: ObjectId, default: null},
  s3Key : {type : String , default : null},
  status : {type : String , default : 'new'},
  validateStatus : {type : String , default : 'none'},
  deployStatus : {type : String , default : 'none'}
});
 
module.exports = mongoose.model('Archive', Archive);