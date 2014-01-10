var nodeforce = require("../lib/nodeforce"),
	async = require("async"),
	ChangeSet = require("../model/changeset"),
	SFConnection = require("../model/sfconnection"),
	s3service = require("../service/s3service"),
	Archive = require("../model/archive"),
	Validation = require("../model/validation"),
	Deployment = require("../model/deployment"),
	CommonService = require("./commonservice"),
	fs = require('fs');

var ChangeSetService = function(){}

exports.doArchiveAction = function(sfconnId,archiveId,userId){
	this.updateArchiveStatus(archiveId,'inProcess');
	var zipFileName = userId+'_'+archiveId+'.zip';
	SFConnection.findById(sfconnId,'-fileInfo',function(err,sfconn){
		if(err || sfconn == null){
			this.updateArchiveStatus(archiveId,'error');
		}else{
			console.log('find sfconn '+sfconn.name);
			CommonService.connect2SFDC(sfconn,function(err,client){
				if(err)this.updateArchiveStatus(archiveId,'error');
				if(client){
					console.log('login sf with '+sfconn.name);
					Archive.findById(archiveId,function(err,archive){
						if(err || archive == null){
							this.updateArchiveStatus(archiveId,'error');
						}else{
							console.log('find archive '+archive.name);
							ChangeSet.findById(archive.changeSetId,function(err,changeSet){
								if(err || changeSet == null || changeSet.files == null){
									this.updateArchiveStatus(archiveId,'error');
								}else{
									console.log('find ChangeSet '+changeSet.name);
									var opts = {
										apiVersion : 29.0,
										unpackaged : {}
									}
									var unpackagedTypes = [];
									for(var j=0;j<changeSet.files.length;j++){
										var fileInfo = changeSet.files[j];
										var packName = fileInfo.packName;
										for(var i=0;i<fileInfo.files.length;i++){
											var fileName = (fileInfo.files[i].split('/')[1]).split('.')[0];
											var upackType = {
												members : fileName,
												name : packName
											};
											unpackagedTypes.push(upackType);
										}
									}
									opts.unpackaged.types = unpackagedTypes;
									console.log('begin retrieve data');
									retrieveData(client,opts,zipFileName,function(err,data){
										if(err) this.updateArchiveStatus(archiveId,'fail');
										else if(data){
											//todo s3 storage
											s3service.uplaodData(zipFileName,function(err,s3key){
												if(err) this.updateArchiveStatus(archiveId,'fail');
												else{
													this.updateArchiveStatus(archiveId,'done',s3key);
													if(!sfconn.remainSFConn){
														SFConnection.findByIdAndRemove(sfconnId);
													}
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

ChangeSetService.prototype.validate = function(validation,filePath,callback){

};

//callback err: 1(fail,can retry action) 0(done) -1(err,action will never sucess)
ChangeSetService.prototype.deploy = function(deployment,filePath,callback){
	CommonService.checkFileExists(filePath,function(err){
		if(err)callback(err);
		else{
			SFConnection.findById(deployment.targetSFConnId,function(err,sfconn){
				if(err) callback(err);
				else{
					CommonService.connect2SFDC(sfconn,function(err,client){
						if(err)callback(err);
						else{
							fs.readFile(filePath,{encoding:'base64'},function(err,data){
								if(err)callback(err);
								else{
									client.deploy(data,{

									},function(err,response,request){

									});
								}
							});
						}
					})
				}
			});
		}
	});
};

ChangeSetService.prototype.retrieveData = function(client,opts,fileName,callback){
	client.retrieve(opts,function(err,response,request){
		var result=response.result;
		var intervalId=setInterval(function(){
			client.checkStatus({Id:result.id},function(err,resp,reqs){
				var result1=resp.result[0];
				if(result1.done){
					clearInterval(intervalId);
					client.checkRetrieveStatus({Id:result.id},function(err,resp1,req1){
						if(resp1 && resp1.result && resp1.result.zipFile){
							console.log('retrieve data done');
							if(resp1.result.zipFile.length <= 100*1024*1024){
								CommonService.confirmDirExists('./temp',function(err,data){
									if(err) callback(err);
									else{
										fs.writeFile('./temp/'+fileName,resp1.result.zipFile,{encoding:'base64'},function(err){
											if(err){
												callback(err);
											}else {
												console.log('/temp/' + fileName + ' save done.');
												callback(null,'Fileprepared');
											}
										});
									}
								});
							}else{
								callback(err);
								console.log('Too large file size( >100M ).');
							}
						}
					});
				}else{
					console.log('checkStatus of download state : '+result1.state);
				}
			});
		},1000);
	});
};

//update archive status
exports.updateArchiveStatus = function(archiveId,status,s3key){
	Archive.findById(archiveId,function(err,archive){
		if(archive){
			if(s3key && s3key != null && s3key != ''){
				archive.update({
					status : status,
					s3Key  : s3key
				});
			}else{
				archive.update({
					status : status
				});
			}
		}
	});
};


//update archive  validateStatus
exports.updateArchiveValidateStatus = function(archiveId,status){
	Archive.findById(archiveId,function(err,archive){
		if(archive){
			archive.update({validateStatus:status});
		}
	});
};

//update archive deployStatus
exports.updateArchiveDeplyStatus = function(archiveId,status){
	Archive.findById(archiveId,function(err,archive){
		if(archive){
			archive.update({deployStatus:status});
		}
	});
};

//update changeset validateStatus
exports.updateValidateStatus = function(changeSetId,status){
	ChangeSet.findById(changeSetId,function(err,changeSet){
		if(changeSet){
			changeSet.update({validateStatus:status});
		}
	});
};

//update changeset deployStatus
exports.updateDeployStatus = function(changeSetId,status){
	ChangeSet.findById(changeSetId,function(err,changeSet){
		if(changeSet){
			changeSet.update({deployStatus:status});
		}
	});
};

//update validation status
exports.updateValidationStatus = function(validationId,status){
	Validation.findById(validationId,function(err,validation){
		if(validation){
			validation.update({status:status});
		}
	});
};

//update deployment status
exports.updateDeploymentStatus = function(deploymentId,status){
	Deployment.findById(deploymentId,function(err,deployment){
		if(deployment){
			deployment.update({status:status});
		}
	});
};