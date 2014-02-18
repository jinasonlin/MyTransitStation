var nodeforce = require("../lib/nodeforce"),
 	SFConnection = require("../model/sfconnection"),
 	ChangeSet = require("../model/changeset"),
 	Archive = require("../model/archive"),
 	Validation = require("../model/validation"),
	Deployment = require("../model/deployment"),
 	async = require("async"),
 	Moment = require("moment"),
 	changeSetService = require('../service/changesetservice'),
 	commonservice = require('../service/commonservice');

 	Moment.lang('en_gb');

exports.listSFConn = function(req,res){
	var errMessage = req.query.errMessage;
	SFConnection.find({createdBy: req.session.user._id,sfconntype : 'normal'},
		'-fileInfo', 
		{sort : {name : 'asc'}},
		function(err,SFConnections){
		if(err){
			res.render('sfconnection/sfconnManage',{
				err:err,
				title : 'SFConnection',
				SFConnections:[],
				errMessage : errMessage||'',
				single_select_choose1 : 'sandbox',
				single_select_choose2 : 'production'
			});
		}else {
			res.render('sfconnection/sfconnManage',{
				SFConnections:SFConnections,
				title : 'SFConnection',
				errMessage : errMessage||'',
				single_select_choose1 : 'sandbox',
				single_select_choose2 : 'production'
			});
		}
	})
};

exports.addSFConn = function(req,res){
	var newSFConn={
		name : req.body.connName,
		username : req.body.username,
		password : req.body.password,
		secureToken : req.body.secureToken,
		conn_env : req.body.endpoint,
		createdBy : req.session.user._id
	};
	var isStore = req.body.isStore;
	var csId = req.body.csId;
	var triggel_name = req.body.triggleName;
	var name = req.body.name;
	if(csId && triggel_name){
		if(!isStore){
			newSFConn.sfconntype = 'temp';
		}
	}
	new SFConnection(newSFConn).save(function(err,docs){
		if(err) res.send({errMessage : 'Save Error'});
		else {
			if(docs.sfconntype == 'normal'){
				syncSFConnFile(docs._id);
			}
			if(csId){
				ChangeSet.findById(csId,function(err,changeSet){
					if(changeSet){
						if('none' == changeSet.validateStatus && 'none' == changeSet.deployStatus){
							if('validation' == triggel_name){
								var newValidation = {};
									newValidation.name = name;
									newValidation.changeSetId = csId;
									newValidation.targetSFConnId = docs._id;
									newValidation.createdBy = req.session.user._id;
									new Validation(newValidation).save(function(err){
										if(!err){
											changeSetService.updateValidateStatus(changeSet._id,'block',function(err){
												if(err)console.log(err);
											});
										}
									});
								}
							}
							if('deployment' == triggel_name){
								var newDeployment = {};
								newDeployment.name = name;
								newDeployment.changeSetId = csId;
								newDeployment.targetSFConnId = docs._id;
								newDeployment.createdBy = req.session.user._id;
								new Deployment(newDeployment).save(function(err){
									if(!err){
										changeSetService.updateDeployStatus(changeSet._id,'block',function(err){
											if(err)console.log(err);
										});
									}
								});
							}
						} 
					res.redirect('/sfconn/'+global.sfconn._id+'/changeSets/'+csId);
				});
			}else{
				res.redirect('/sfconn');
			}
		}
	});
};

exports.deleteSFConn = function(req,res){
	var sfconnId = req.params.sfconnId;
	SFConnection.findByIdAndRemove(sfconnId,function(err){
		if(err)res.send({errMessage:err});
		else {
			res.send('done');
		}
	})
};

exports.listSFConnInfo = function(req,res){
	var sfconnId = req.params.sfconnId;
	var sfconnInfo = SFConnection.findById(sfconnId,
		'-fileInfo', 
		function(err,docs){
		if(!err){
			global.sfclient = nodeforce.createClient({
				username : docs.username,
				password : docs.password + docs.secureToken,
				endpoint : docs.conn_env
			});
	  		global.sfclient.login(function(err, response, lastRequest) {
	    		if (global.sfclient.userId) {
	    			global.sfconn = docs;
	    			ChangeSet.find({
	    				createdBy : req.session.user._id,
	    				sfconnId : req.params.sfconnId
	    			},'',{
	    				sort : { createdDate : 'desc'}
	    			},function(err,ChangeSets){
				      	res.render('sfconnection/sfconnInfo',{
							title : 'SFConnection | '+docs.name,
							sfconn : docs,
							changeSets : ChangeSets || [new ChangeSet()],
							user : req.session.user
						});
	    			});
	    		} else {
			      res.redirect("/sfconn?errMessage=Login with "+docs.name+" failed, please check your SFConnection username and password!");
			    }
	  		});
		}else{
			res.redirect('/sfconn');
		}
	});
};

exports.updateSFConn = function(req,res){
	var sfconnId=req.params.sfconnId;
	var updataSFConn = {
		name : req.body.connName,
		username : req.body.username,
		password : req.body.password,
		secureToken : req.body.secureToken,
		conn_env : req.body.endpoint
	};
	SFConnection.findByIdAndUpdate(sfconnId,updataSFConn,function(err){
		res.redirect('/sfconn');
		syncSFConnFile(sfconnId);
	});
};

exports.validateSFConn = function(req,res){
	var sfconn = req.body.sfconn;
	var client = nodeforce.createClient({
		    username: sfconn.username,
		    password: sfconn.password + sfconn.secureToken,
		    endpoint: sfconn.conn_env
	});
  	client.login(function(err, response, lastRequest) {
	    if (client.userId) {
	      res.send('validate');
	    } else {
	      res.send("unValidate");
	    }
	});
};

exports.logoutSFConn = function(req,res){
	global.sfclient = undefined;
	global.sfconn = undefined;
	res.redirect('/sfconn');
}

exports.changeSetInit = function(req,res){
	var csId = req.query.csId;
	SFConnection.findById(req.params.sfconnId,function(err,data){
		if(!err){
			if('done'==data.syncFileStatus && data.fileInfo && data.fileInfo.length>0){
				if(csId){
					ChangeSet.findById(csId,function(err,changeSet){
						var csFileStr = '';
						var csFileStrLength = 0;
						var checkedFileLength = 0;
						async.series([function(callback){
							for(var k=0;k<changeSet.files.length;k++){
								for(var x=0;x<changeSet.files[k].files.length;x++){
									csFileStr += ('$'+changeSet.files[k].files[x]+'$');
								}
							}
							csFileStrLength = csFileStr.length;
							callback(null,'getChangeSetAllFiles done');
						},function(callback){
							for(var i=0;i<data.fileInfo.length;i++){
								var metaData=data.fileInfo[i];
								for(var j=0;j<metaData.childFiles.length;j++){
									var file = metaData.childFiles[j];
									if(csFileStr.indexOf("$"+file.fileName+"$")>-1){
										file.isChecked = true;
										checkedFileLength += file.fileName.length + 2;
									}
									if(csFileStrLength == checkedFileLength){
										break;
									}
								}
								if(csFileStrLength == checkedFileLength){
									break;
								}
							}
							callback(null,'check data done');
						}],function(err,results){
							res.render('sfconnection/newChangeSet', {
								title : 'ChangeSet | '+changeSet.name,
								_sfconn : data,
								changeSet : changeSet
							});
						});
					});
				}else{
					res.render('sfconnection/newChangeSet', {
						title : 'ChangeSet | New ChangeSet',
						_sfconn : data
					});
				}
			}else{
				if('none'!=data.syncFileStatus||'done'!=data.syncFileStatus){
					syncSFConnFile(data._id);
					res.render('sfconnection/newChangeSet', {
						title : 'ChangeSet | New ChangeSet',
						_sfconn : data,
						message : 'File sync is InProgress, please refresh this page few seconds later :).'
					});
				}
			}
		}
	});
};

exports.changeSetSave = function(req,res){
	var selectFiles = req.body.selectFiles;
	var csId = req.query.csId;
	var cs = {
		name : req.body.csName,
		files : [],
		sfconnId : req.params.sfconnId,
		createdBy : req.session.user._id
	};
	if(selectFiles && selectFiles.length>0){
		async.eachSeries(selectFiles,function(fileInfo,callback){
			var fileInfos = fileInfo.fileName.split('/');
			if(fileInfos && fileInfos.length >= 2){
				var dirName = fileInfos[0];
				var packName = fileInfo.metaName;
				var dirExists = false;
				for(var i=0;i<cs.files.length;i++){
					var pack = cs.files[i];
					if(packName == pack.packName){
						dirExists = true;
						cs.files[i].files.push(fileInfo.fileName);
						break; 
					}
				}
				if(!dirExists){
					var newData = {
						directoryName : dirName,
						files : [fileInfo.fileName],
						packName : packName
					}
					cs.files.push(newData);
				}
			}
			callback(null);
		},function(err){
			if(csId){
				ChangeSet.findById(csId,function(err,changeSet){
					if(err)res.send({message : err});
					else{
						if(changeSet.archiveStatus == 'block'){
							res.send({
								message : 'ChangeSet blocked with archive action.',
								csId : csId
							});
						}else{
							ChangeSet.findByIdAndUpdate(csId,{
								$set : {
									files : cs.files
								}
							},function(err,changeSet){
								if(err)res.send({message : err});
								else res.send({
									message : 'done',
									csId : csId
								});
							});
						}
					}
				});
			}else{
				new ChangeSet(cs).save(function(err,changeSet){
					if(err)res.send({message : err});
					else res.send({
						message : 'done',
						csId : changeSet._id
					});
				});
			}
		});
	}
};

exports.changeSetDelete = function(req,res){
	var csId = req.params.changeSetId;
	ChangeSet.findByIdAndRemove(csId,function(err){
		if(err)res.send(err);
		else res.send('done');
	});
};


exports.changeSetInfo = function(req,res){
	ChangeSet.findById(req.params.changeSetId,function(err,docs){
		if(err)res.redirect('/sfconn/'+req.params.sfconnId);
		else{
			if(docs){
				async.parallel([function(callback){
					Archive.find({changeSetId:req.params.changeSetId},'',{sort:{createdDate:'desc'}},function(err,archives){
						callback(null,archives||[]);
					});
				},function(callback){
					Validation.find({changeSetId:req.params.changeSetId},'',{sort:{createdDate:'desc'}},function(err,validations){
						callback(null,validations||[]);
					});
				},function(callback){
					Deployment.find({changeSetId:req.params.changeSetId},'',{sort:{createdDate:'desc'}},function(err,deployments){
						callback(null,deployments||[]);
					});
				},function(callback){
					SFConnection.find({
						createdBy : req.session.user._id,
						_id : {
							$ne : global.sfconn._id
						},
						sfconntype : 'normal'
					},'-fileInfo',{sort:{name:'asc'}},function(err,sfconns){
						callback(null,sfconns||[])
					});
				}],function(err,results){
					res.render('sfconnection/changeSetInfo',{
						title : 'ChangeSet | '+docs.name,
						changeSet :  docs,
						sfconn : global.sfclient,
						archives : results[0],
						validates : results[1],
						deploys : results[2] ,
						sfconns : results[3],
						single_select_choose1 : 'Choose One',
						single_select_choose2 : 'New One'
					});
				});
			}else{
				res.render('404',{
					title : '404',
				});
			}
		}
	});
};

exports.syncFile = function(req,res){
	if(req.params.sfconnId){
		syncSFConnFile(req.params.sfconnId);
		res.redirect('/sfconn');
	}
}

function syncSFConnFile(sfconnId){
	SFConnection.findById(sfconnId,function(err,docs){
		if(!err){
			var sfclient = nodeforce.createClient({
				username : docs.username,
				password : docs.password + docs.secureToken,
				endpoint : docs.conn_env
			});
	  		sfclient.login(function(err, response, lastRequest) {
	    		if (sfclient.userId) {
	    			if('InProgress' != docs.syncFileStatus){
	    				console.log('begin to sync file of sfconn(id : '+sfconnId+')');
	    				docs.update({
		    				syncFileStatus : 'InProgress'
		    			},function(err){
		    				if(err)console.log(err);
		    			});
				      	sfclient.describe(function(err,response,request){
							var allData=[];
							if(response.result && response.result.metadataObjects){
								var metadataObjects = response.result.metadataObjects;
								metadataObjects.sort();
								async.each(metadataObjects,function(item,callback){
									var metaData ={};
									metaData.metaObject = item;
									sfclient.list({
										queries:[{
											folder:item.directoryName,
											type:item.xmlName
										}],
										asOfVersion:'29.0'
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
										docs.update({
											syncFileStatus : 'fail',
											lastFileSyncDate : new Date()
										},function(err){
											if(err)console.log(err);
										});
									} else {
										docs.update({
											fileInfo : allData,
											syncFileStatus : 'done',
											lastFileSyncDate : new Date()
										},function(err,data){
											if(err)console.log('update fileinfo of sfconn(id : '+docs._id+') err. errMessage : '+err);
											else console.log('update fileinfo of sfconn(id : '+docs._id+') complete.');
										});
									}
								});
							}
						});
	    			}
	    		}else{
	    			console.log('failed to log in sfdc with sfconn(id : '+sfconnId+')');
	    		} 
	  		});
		}
	});
}

exports.authcallback = function(req,res){
	res.render('sfconnection/authcallback');
}