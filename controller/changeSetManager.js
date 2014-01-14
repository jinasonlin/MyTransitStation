var Archive = require("../model/archive"),
	ChangeSet = require("../model/changeset"),
	Validation = require("../model/validation"),
	Deployment = require("../model/deployment");
	Moment = require("moment"),
	changeSetService = require('../service/changesetservice');

exports.addArchive = function(req,res){
	var csId = req.params.changeSetId;
	var name = req.query.name;
	ChangeSet.findById(csId,function(err,changeSet){
		if(err || changeSet == null) res.send("Cant't find the ChangeSet with id : "+csId);
		else{
			var newArchive = {};
			newArchive.name = name;
			newArchive.changeSetId = csId;
			newArchive.createdBy = req.session.user._id;
			new Archive(newArchive).save(function(err,docs){
				if(err) res.send("Save Error.Cant't handle this archive save request.");
				else{
					if(docs && docs._id){
						changeSetService.updateArchiveStatus(csId,'block',function(err){
							if(err)res.send(err);
							else res.send('done');
						});
					}else{
						res.send('done');
					}
				}
			});
		}
	});
};

exports.deleteArchive = function(req,res){
	var archiveId = req.params.archiveId;
	if(archiveId){
		Archive.findByIdAndRemove(archiveId,function(err,doc){
			if(err) res.send(err);
			else {
				changeSetService.checkCSArchiveStatus(doc.changeSetId,function(err){
					if(err)res.send(err);
					else res.send('done');
				});
			}
		});
	}
};

exports.deleteValidation = function(req,res){
	var validationId = req.params.validationId;
	if(validationId){
		Validation.findByIdAndRemove(validationId,function(err,doc){
			if(err) res.send(err);
			else {
				changeSetService.checkCSValidateStatus(doc.changeSetId,function(err){
					if(err)res.send(err);
					else res.send('done');
				});
			}
		});
	}
};

exports.deleteDeployment = function(req,res){
	var deploymentId = req.params.deploymentId;
	if(deploymentId){
		Deployment.findByIdAndRemove(deploymentId,function(err,doc){
			if(err)res.send(err);
			else {
				changeSetService.checkCSDeployStatus(doc.changeSetId,function(err){
					if(err)res.send(err);
					else res.send('done');
				});
			}
		});
	}
};