var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var Deployment = new Schema({
  name : String ,
  createdDate: {type: Date, default: Date.now},
  changeSetId: {type: ObjectId, default: null},
  archiveId: {type: ObjectId, default: null},
  status : {type : String , default : 'new'},
  targetSFConnId : {type: ObjectId, default: null},
  isTargetSFConnSave : {type : Boolean,default : false},
  remainDeployment : {type : Boolean,default : true}
});
 
module.exports = mongoose.model('Deployment', Deployment);