"use strict";
var	ChangeSet = require("../model/changeset"),
	Archive = require("../model/archive"),
	Validation = require("../model/validation"),
	Deployment = require("../model/deployment"),
	async = require("async");

var tag = "Daemon : ";
var init = true;


exports.run = function() {
	console.log(tag + "start run!");

	var checkProess = function () {
		async.series([
		    function(callback){
				checkArchive(function(err){
					console.log(tag + "check archive over. err = " + err);
					callback(err);
				});
		    },
		    function(callback){
				checkValidation(function(err){
					console.log(tag + "check validation over. err = " + err);
					callback(err);
				});
		    },
		    function(callback){
				checkDeployment(function(err){
					console.log(tag + "check deployment over. err = " + err);
					callback(err);
				});
		    },
		    function(callback){
				checkChangeSet(function(err){
					console.log(tag + "check changeSet over. err = " + err);
					callback(err);
				});
		    }
		],
		function(err){
			init = false;
			console.log(tag + "db checkover! err = " + err);
		});
	};

	checkProess();
	/*setInterval(function() {
		checkProess();
	}, 1000*60*10);*/
};

var checkArchive = function(callback) {
	Archive.find(null, function(err, docs) {
		async.each(docs, function (doc, cb) {
			var aperture = 1000*60*60;
			var date_current = new Date();
			var date_created = new Date(doc.createdDate);
			if(doc.status !== "done" && doc.status !== "fail") {
				if(init || date_current - date_created >= aperture) {
					doc.update({status : "fail"}, function(e) {
						cb(null);
					});
				} else {
					cb(null);
				}
			} else {
				cb(null);
			}
		}, function (err){
			callback(err);
		});
	});
};

var checkValidation = function(callback) {
	Validation.find(null, function(err, docs) {
		async.each(docs, function (doc, cb) {
			var aperture = 1000*60*60;
			var date_current = new Date();
			var date_created = new Date(doc.createdDate);
			if(doc.status !== "done" && doc.status !== "fail") {
				if(init || date_current - date_created >= aperture) {
					doc.update({status : "fail"}, function(e) {
						cb(null);
					});
				} else {
					cb(null);
				}
			} else {
				cb(null);
			}
		}, function (err){
			callback(err);
		});
	});
};

var checkDeployment = function(callback) {
	Deployment.find(null, function(err, docs) {
		async.each(docs, function (doc, cb) {
			var aperture = 1000*60*60;
			var date_current = new Date();
			var date_created = new Date(doc.createdDate);
			if(doc.status !== "done" && doc.status !== "fail") {
				if(init || date_current - date_created >= aperture) {
					doc.update({status : "fail"}, function(e) {
						cb(null);
					});
				} else {
					cb(null);
				}
			} else {
				cb(null);
			}
		}, function (err){
			callback(err);
		});
	});
};

var checkChangeSet = function(callback) {
	ChangeSet.find(null, function(err, docs) {
		async.each(docs, function (doc, cb) {
			async.parallel([
			    function(callback){
					updateCSArchiveStatus(doc._id, function(err){
						console.log(tag + doc._id + ": updateCSArchiveStatus " + err);
						callback(err);
					});
			    },
			    function(callback){
					updateCSValidateStatus(doc._id, function(err){
						console.log(tag + doc._id + ": updateCSValidateStatus " + err);
						callback(err);
					});
			    },
			    function(callback){
					updateCSDeployStatus(doc._id, function(err){
						console.log(tag + doc._id + ": updateCSDeployStatus " + err);
						callback(err);
					});
			    }
			],
			function(err){
				console.log(tag + doc._id + " checkover. " + err);
				cb(err);
			});
		}, function (err){
			if(callback) callback(err);
		});
	});
};

//-----------------------------------------------------------------------

var updateCSArchiveStatus = function(csId, callback){
	Archive.find({changeSetId : csId},function(err,archives){
		if(archives){
			if(archives.length > 0){
				var isBreak = false;
				var inline = function () {
					ChangeSet.findByIdAndUpdate(csId,{archiveStatus : "block"},function(err){
						if(err) callback(err);
						else callback(null);
					});
				};
				inline();
			} else {
				ChangeSet.findByIdAndUpdate(csId,{archiveStatus : "none"},function(err){
					if(err) callback(err);
					else callback(null);
				});
			}
		}
    });
};

var updateCSValidateStatus = function(csId, callback){
	Validation.find({changeSetId:csId},function(err,validations){
		if(validations){
			if(validations.length > 0){
				var isBreak = false;
				var inline = function () {
					ChangeSet.findByIdAndUpdate(csId,{validateStatus:"block"},function(err){
						if(err) callback(err);
						else callback(null);
					});
				};
				for(var i=0;i<validations.length;i++){
					var validation = validations[i];
					if(validation.status == "inProcess"){
						inline();
						isBreak = true;
						break;
					}
				}
				if(!isBreak){
					ChangeSet.findByIdAndUpdate(csId,{validateStatus : "done"},function(err){
						if(err)callback(err);
						else callback(null);
					});
				}
			} else {
				ChangeSet.findByIdAndUpdate(csId,{validateStatus : "none"},function(err){
					if(err) callback(err);
					else callback(null);
				});
			}
		}
	});
};

var updateCSDeployStatus = function(csId,callback){
	Deployment.find({changeSetId:csId},function(err,deployments){
		if(deployments){
			if(deployments.length > 0){
				var isBreak = false;
				var inline = function () {
					ChangeSet.findByIdAndUpdate(csId,{deployStatus:"block"},function(err){
						if(err) callback(err);
						else callback(null);
					});
				};
				for(var i=0;i<deployments.length;i++){
					var deployment = deployments[i];
					if(deployment.status == "inProcess"){
						inline();
						isBreak=true;
						break;
					}
				}
				if(!isBreak){
					ChangeSet.findByIdAndUpdate(csId,{deployStatus:"done"},function(err){
						if(err)callback(err);
						else callback(null);
					});
				}
			} else {
				ChangeSet.findByIdAndUpdate(csId,{deployStatus : "none"},function(err){
					if(err) callback(err);
					else callback(null);
				});
			}
		}
	});
};

var checkObject = function (obj) {
	for (var i in obj) {
		if (obj[i] === null || obj[i] === undefined || obj[i] === "") {
			delete obj[i];
		}
	}
};