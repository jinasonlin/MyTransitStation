"use strict";
var ChangeSetService = require("../service/changesetservice"),
	Moment = require("moment");

	Moment.lang("en_gb");

exports.changeSetInit = function(req,res){
	var data = {
		id : req.params.sfconnId,
		csId : req.query.csId
	};
	var callback = {
		showChangeSet : function (account, changeSet) {
			res.render("sfconnection/newChangeSet", {
				title : "ChangeSet | " + changeSet.name,
				_sfconn : account,
				changeSet : changeSet
			});
		},
		newChangeSet : function (account) {
			res.render("sfconnection/newChangeSet", {
				title : "ChangeSet | New ChangeSet",
				_sfconn : account
			});
		},
		syncing : function (account) {
			//syncSFConnFile(account._id);
			res.render("sfconnection/newChangeSet", {
				title : "ChangeSet | New ChangeSet",
				_sfconn : account,
				message : "File sync is InProgress, please refresh this page few seconds later :)."
			});
		},
		error : function () {

		}
	};
	ChangeSetService.changeSetInit(data, callback);
};

exports.changeSetSave = function(req,res){
	var data = {
		selectFiles : req.body.selectFiles,
		csId : req.query.csId,
		cs : {
			name : req.body.csName,
			files : [],
			sfconnId : req.params.sfconnId,
			createdBy : req.session.user._id
		}
	};

	var callback = {
		response : function (message) {
			res.send(message);
		}
	};

	ChangeSetService.changeSetSave(data, callback);
};

exports.changeSetInfo = function(req,res){
	var data = {
		changeSetId : req.params.changeSetId,
		session : req.session
	};

	var callback = {
		success : function (changeSet, results) {
			res.render("sfconnection/changeSetInfo",{
				title : "ChangeSet | " + changeSet.name,
				changeSet :  changeSet,
				sfconn : global.sfclient,
				archives : results[0],
				validates : results[1],
				deploys : results[2] ,
				sfconns : results[3],
				single_select_choose1 : "Choose One",
				single_select_choose2 : "New One"
			});
		},
		error : function () {
			res.render("404",{
				title : "404",
			});
		}
	};

	ChangeSetService.changeSetInfo(data, callback);
};

exports.changeSetDelete = function(req,res){
	var data = {
		csId : req.params.changeSetId
	};
	var callback = {
		response : function (message) {
			res.send(message);
		}
	};

	ChangeSetService.changeSetDelete(data, callback);
};

exports.addArchive = function(req,res){
	var data = {
		csId : req.params.changeSetId,
		name : req.query.name,
		session : req.session
	};

	var callback = {
		response : function (message) {
			res.send(message);
		}
	};

	ChangeSetService.addArchive(data, callback);
};

exports.deleteArchive = function(req,res){
	var data = {
		archiveId : req.params.archiveId
	};

	var callback = {
		response : function (message) {
			res.send(message);
		}
	};

	ChangeSetService.deleteArchive(data, callback);
};

exports.addValidation = function(req,res){
	var data = {
		csId : req.params.changeSetId,
		name : req.body.name,
		archiveId : req.body.archiveId,
		targetSFConnId : req.body.targetSFConnId,
		session : req.session
	};

	var callback = {
		response : function (message) {
			res.send(message);
		}
	};

	ChangeSetService.addValidation(data, callback);
};

exports.deleteValidation = function(req,res){
	var data = {
		validationId : req.params.validationId
	};
	var callback = {
		response : function (message) {
			res.send(message);
		}
	};

	ChangeSetService.deleteValidation(data, callback);
};

//TODO
exports.addDeployment = function(req,res){
	var data = {
		csId : req.params.changeSetId,
		name : req.body.name,
		archiveId : req.body.archiveId,
		targetSFConnId : req.body.targetSFConnId,
		session : req.session
	};

	var callback = {
		response : function (message) {
			res.send(message);
		}
	};

	ChangeSetService.addDeployment(data, callback);
};

exports.deleteDeployment = function(req,res){
	var data = {
		deploymentId : req.params.deploymentId
	};
	var callback = {
		response : function (message) {
			res.send(message);
		}
	};

	ChangeSetService.deleteDeployment(data, callback);
};