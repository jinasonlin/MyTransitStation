"use strict";
var AccountServer = require("../service/accountServer"),
	ChangeSet = require("../model/changeset"),
	Moment = require("moment");

Moment.lang("en_gb");

exports.authcallback = function(req,res){
	res.render("sfconnection/authcallback");
};

exports.validateAccount = function(req, res){
	var account = {
		sid : req.body.sid,
		userId : req.body.userId,
		endpoint : req.body.endpoint,
	};
	AccountServer.validateAccount(account, {
		success : function(){
			res.send("validate");
		},
		error : function(){
			res.send("unValidate");
		}
	});
};

exports.listAccount = function (req, res) {
	var errMessage = req.query.errMessage;
	var data = {
		id : req.session.user._id
	};

	AccountServer.listAccount(data, {
		success : function(SFConnections){
			res.render("sfconnection/sfconnManage",{
				SFConnections:SFConnections,
				title : "SFConnection",
				errMessage : errMessage||"",
				single_select_choose1 : "production",
				single_select_choose2 : "sandbox"
			});
		},
		error : function(err){
			res.render("sfconnection/sfconnManage",{
				err:err,
				title : "SFConnection",
				SFConnections:[],
				errMessage : errMessage||"",
				single_select_choose1 : "production",
				single_select_choose2 : "sandbox"
			});
		}
	});
};

exports.addAccount = function (req, res) {
	console.log("session user _id = " + req.session.user._id);
	var newAccount = {
		orgId : req.body.orgId,
		orgName : req.body.orgName,
		sid : req.body.sid,
		userId : req.body.userId,
		endpoint : req.body.endpoint,
		createdBy : req.session.user._id
	};
	var isStore = req.body.isStore;
	var csId = req.body.csId;
	var triggel_name = req.body.triggleName;
	if(csId && triggel_name){
		if(!isStore){
			newAccount.accountType = "temp";
		}
	}

	AccountServer.addAccount(newAccount, {
		success : function(){
			res.send("done");
		},
		error : function(err){
			res.send(err);
		}
	});
};

exports.deleteAccount = function (req, res) {
	var data = {
		id : req.params.sfconnId
	};

	AccountServer.deleteAccount(data, {
		success : function(){
			res.send("done");
		},
		error : function(err){
			res.send({errMessage:err});
		}
	});
};

exports.updateAccount = function (req, res) {
	var updataAccount = {
		//sid : req.body.sid,
		//userId : req.body.userId,
		//endpoint : req.body.endpoint,
		orgName : req.body.orgName
	};
	var data = {
		id : req.params.sfconnId,
		updataAccount : updataAccount
	};

	AccountServer.updateAccount(data, {
		success : function(){
			res.send("done");
			//syncSFConnFile(id);
		},
		error : function(){
		}
	});
};

exports.syncAccountFile = function (req, res) {
	if(!req.params.sfconnId){
		return;
	}
	var data = {
		id : req.params.sfconnId
	};
	var callbacks = {
		success : function () {
			res.send("done");
			//res.redirect("/sfconn");
		}
	};
	AccountServer.syncAccountFile(data, callbacks);
};

exports.listAccountInfo = function(req, res){
	var data = {
		id : req.params.sfconnId,
		session : req.session
	};
	var callbacks = {
		loginSuccess : function (account, ChangeSets) {
			res.render("sfconnection/sfconnInfo",{
				title : "SFConnection | " + account.userName,
				sfconn : account,
				changeSets : ChangeSets || [new ChangeSet()],
				user : req.session.user
			});
		},
		loginError : function (account) {
			res.redirect("/sfconn?errMessage=Login with " + account.name + " failed, please authorization app again!");
		},
		failed : function () {
			res.redirect("/sfconn");
		}
	};
	AccountServer.listAccountInfo(data, callbacks);
};