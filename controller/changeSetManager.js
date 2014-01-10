var Archive = require("../model/archive"),
	ChangeSet = require("../model/changeset"),
	Validation = require("../model/validation"),
	Deployment = require("../model/deployment");
	Moment = require("moment");

exports.addArchive = function(req,res){
	var csId = req.params.changeSetId;
	ChangeSet.findById(csId,function(err,changeSet){
		if(err || changeSet == null) res.send("Cant't find the ChangeSet with id : "+csId);
		else{
			var newArchive = {};
			newArchive.name = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			newArchive.changeSetId = csId;
			new Archive(newArchive).save(function(err,docs){
				if(err) res.send("Save Error.Cant't handle this archive save request.");
				else{
					if(docs._id){
						changeSet.update({
							archiveStatus : 'block'
						},function(err,data){
							if(err) res.send("Save Error.Cant't update the ChangeSet archiveStatus with id : "+changeSet._id);
						});
					}
					res.send('done');
				}
			});
		}
	});
};

exports.addValidation = function(req,res){
	var csId = req.params.changeSetId;
	var archiveId = req.query.archiveId;
	ChangeSet.findById(csId,function(err,changeSet){
		if(err || changeSet == null) res.send("Cant't find the ChangeSet with id : "+csId);
		else{
			var newValidation = {};
			newValidation.name = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			newValidation.changeSetId = csId;
			if(archiveId){
				newValidation.archiveId = archiveId;
			}
			new Validation(newValidation).save(function(err,docs){
				if(err) res.send("Save Error.Cant't handle this validation save request.");
				else{
					if(docs._id){
						changeSet.update({
							validateStatus : 'inProgress'
						},function(err,data){
							if(err) res.send("Save Error.Cant't update the ChangeSet archiveStatus with id : "+changeSet._id);
						});
					}
					res.send('done');
				}
			});
		}
	});
};

exports.addDeployment = function(req,res){
	var csId = req.params.changeSetId;
	var archiveId = req.query.archiveId;
	ChangeSet.findById(csId,function(err,changeSet){
		if(err || changeSet == null) res.send("Cant't find the ChangeSet with id : "+csId);
		else{
			var newDploment = {};
			newDploment.name = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			newDploment.changeSetId = csId;
			if(archiveId){
				newDploment.archiveId = archiveId;
			}
			new Deployment(newDploment).save(function(err,docs){
				if(err) res.send("Save Error.Cant't handle this deployment save request.");
				else{
					if(docs._id){
						changeSet.update({
							deployStatus : 'inProgress'
						},function(err,data){
							if(err) res.send("Save Error.Cant't update the ChangeSet archiveStatus with id : "+changeSet._id);
						});
					}
					res.send('done');
				}
			});
		}
	});
}