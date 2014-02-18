"use strict";
var Account = require("../model/account"),
	ChangeSet = require("../model/changeset"),
	nodeforce = require("../lib/nodeforce"),
	async = require("async");

exports.validateAccount = function (data, options) {
	var client = nodeforce.createClient({
		    sid: data.sid,
		    userId: data.userId,
		    endpoint: data.endpoint
	});
	client.login(function(err, response, lastRequest) {
	    if (!err) {
			options.success();
	    } else {
			options.error();
	    }
	});
};

exports.listAccount = function (data, options) {
	Account.find({createdBy: data.id, accountType : "normal"},
		"-fileInfo",	{sort : {name : "asc"}},
		function(err,accounts){
			if(err){
				options.error(err);
			}else {
				options.success(accounts);
			}
	});
};

exports.addAccount = function (data, options) {
	//TODO
	//还缺少changeSet部分的登入
	var saveData = function (data) {
		Account.find({organizationId: data.organizationId},
			"-fileInfo",	{sort : {name : "asc"}},
			function(err,accounts){
				if(err){
					options.error();
				} else if(accounts && accounts.length === 0) { 
					new Account(data).save(function(err, account){
						if(err){
							options.error();
						}else {
							options.success();
						}
					});
				} else {
					accounts[0].update(data, function(err, account){
						if(err){
							options.error();
						}else {
							options.success();
						}
					});
				}
		});
	};

	//get User Info and update data
	getUserInfo(data, {
		success : function(err, res) {
			console.log(res);
			data.name = res.result.userName;
			data.userEmail = res.result.userEmail;
			data.organizationId = res.result.organizationId;
			saveData(data);
		}
	});
};

exports.deleteAccount = function (data, options) {
	Account.findByIdAndRemove(data.id, function (err) {
		if(err){
			options.error(err);
		}else {
			options.success();
		}
	});
};

exports.updateAccount = function (data, options) {
	Account.findByIdAndUpdate(data.id, data.updataAccount, function (err) {
		if(err){
			options.error();
		}else {
			options.success();
		}
	});
	//need sync files
};

exports.syncAccountFile = function(data, options){
	syncAccountFile(data.id, options);
};

exports.listAccountInfo = function(data, options){
	var sfconnInfo = Account.findById(data.id,
		"-fileInfo", 
		function(err, account){
			if(!err && account !== null){
				var client = nodeforce.createClient({
				    sid: account.sid,
				    userId: account.userId,
				    endpoint: account.endpoint
				});
				//success : set global sfclient
				client.login(function(err, response, lastRequest) {
					if (!err) {
						ChangeSet.find({
							createdBy : data.session.user._id,
							sfconnId : data.id
						}, "", {
							sort : { createdDate : "desc"}
						}, function(err, ChangeSets){
							if(options.loginSuccess) {
								global.sfclient = client;
								global.sfconn = account;
								options.loginSuccess(account, ChangeSets);
							}
						});
					} else {
						if(options.loginError)options.loginError(account);
					}
				});
			}else{
				if(options.failed)options.failed();
			}
		});
};

/* ----------------------- utility -------------------------- */
exports.getAccount = function (data, options) {
	Account.findById(data.id, function(err, account){
		if(err){
			options.error(err);
		} else {
			options.success(account);
		}
	});
};


/* ------------------ built-in function -------------------- */
function getUserInfo(loginInfo, options) {
	var client = nodeforce.createClient({
		    sid: loginInfo.sid,
		    userId: loginInfo.userId,
		    endpoint: loginInfo.endpoint
	});
	client.login(function(err, response, lastRequest) {
	    if (!err) {
			client.getUserInfo(options.success);
	    } else {
			options.error();
	    }
	});
}

function syncAccountFile (sfconnId, options){
	Account.findById(sfconnId, function(err, account){
		if (!err) {
			var client = nodeforce.createClient({
				sid: account.sid,
				userId: account.userId,
				endpoint: account.endpoint
			});
			client.login(function(err, response, lastRequest) {
				if (!err) {
					if("InProgress" != account.syncFileStatus){
						console.log("begin to sync file of sfconn(id : " + sfconnId + ")");
						account.update({
							syncFileStatus : "InProgress"
						},function(err){
							if(err) {
								console.log(err);
							} else {
								if(options.success){
									options.success();
								}
							}
						});
						client.describe(function(err, response, request){
							var allData=[];
							if(response.result && response.result.metadataObjects){
								var metadataObjects = response.result.metadataObjects;
								metadataObjects.sort();
								async.each(metadataObjects, function(item, callback){
									var metaData ={};
									metaData.metaObject = item;
									client.list({
										queries:[{
											folder:item.directoryName,
											type:item.xmlName
										}],
										asOfVersion:"29.0"
									},function(err,response,request){
										callback(err,response);
										if(!err){
											if(response.result && response.result.length){
												metaData.childFiles = response.result;
												allData.push(metaData);
											}
										}
									});
								},function(err){
									if(err) {
										console.log(err);
										account.update({
											syncFileStatus : "fail",
											lastFileSyncDate : new Date()
										},function(err){
											if(err)console.log(err);
										});
									} else {
										account.update({
											fileInfo : allData,
											syncFileStatus : "done",
											lastFileSyncDate : new Date()
										},function(err,data){
											if(err)console.log("update fileinfo of sfconn(id : "+account._id+") err. errMessage : "+err);
											else console.log("update fileinfo of sfconn(id : "+account._id+") complete.");
										});
									}
								});
							}
						});
					}
				}else{
					console.log("failed to log in sfdc with sfconn(id : "+sfconnId+")");
				} 
			});
		}
	});
}