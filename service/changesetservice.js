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

//callback err: 1(fail,can retry action) 0(done) -1(err,action will never sucess)
exports.archive = function(sfconnId,archiveId,userId,callback){
	var zipFileName = userId+'_'+archiveId+'.zip';
	SFConnection.findById(sfconnId,'-fileInfo',function(err,sfconn){
		if(err || sfconn == null){
			callback(-1);
		}else{
			console.log('find sfconn '+sfconn.name);
			CommonService.connect2SFDC(sfconn,function(err,client){
				if(err)callback(-1);
				if(client){
					console.log('login sf with '+sfconn.name);
					Archive.findById(archiveId,function(err,archive){
						if(err || archive == null){
							callback(-1);
						}else{
							console.log('find archive '+archive.name);
							ChangeSet.findById(archive.changeSetId,function(err,changeSet){
								if(err || changeSet == null || changeSet.files == null){
									callback(-1);
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
										if(err) callback(1);
										else if(data){
											callback(0);
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

//callback err: 1(fail,can retry action) 0(done) -1(err,action will never sucess)
exports.deploy = function(deployment,filePath,checkOnly,callback){
	CommonService.checkFileExists(filePath,function(err){
		if(err)callback(1);
		else{
			console.log('find file '+ fs.realpathSync('.')+filePath + ' on disk.');
			SFConnection.findById(deployment.targetSFConnId,function(err,sfconn){
				if(err) callback(-1);
				else{
					CommonService.connect2SFDC(sfconn,function(err,client){
						if(err)callback(-1);
						else{
							console.log('connect to sfdc sucess');
							fs.readFile('./'+ filePath,{encoding:'base64'},function(err,data){
								if(err)callback(1);
								else{
									console.log('begin do deploy');
									var deployOptions = {
										rollbackOnError : true,
										runAllTests : true,
										ignoreWarnings : false,
										purgeOnDelete : true
									}
									if(checkOnly){
										deployOptions.checkOnly = true;
									}
									client.deploy({
										zipFile : data,
										deployOptions : deployOptions
									},function(err,response,request){
										if(err) callback(1);
										else{
											var result = response.result;
											var intervalId = setInterval(function(){
												client.checkStatus({Id:result.id},function(err,resp,reqs){
													var result1 = resp.result[0];
													if(result1.done){
														console.log('deploy action complete');
														clearInterval(intervalId);
														console.log('stop interval');
														client.checkDeployStatus({
															Id : result.id,
															includeDetails : true
														},function(err,resp1,req1){
															if(resp1 && resp1.result && resp1.result.details){
																callback(0,resp1.result.details);
															}
															if(err) callback(1);
														});
													}else{
														console.log('check deploy status . state :'+result1.state);
													}
												});
											},5000);
										}
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

var retrieveData = function(client,opts,fileName,callback){
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
exports.updateValidateStatus = function(changeSetId,status,callback){
	ChangeSet.findById(changeSetId,function(err,changeSet){
		if(changeSet){
			changeSet.update({validateStatus:status},function(err){
				if(err)callback(err);
				else callback(null);
			});
		}
	});
};

//update changeset deployStatus
exports.updateDeployStatus = function(changeSetId,status,callback){
	ChangeSet.findById(changeSetId,function(err,changeSet){
		if(changeSet){
			changeSet.update({deployStatus:status},function(err){
				if(err)callback(err);
				else callback(null);
			});
		}
	});
};

//update changeset archiveStatus
exports.updateArchiveStatus = function(changeSetId,status,callback){
	ChangeSet.findById(changeSetId,function(err,changeSet){
		if(changeSet){
			changeSet.update({archiveStatus:status},function(err){
				if(err)callback(err);
				else callback(null);
			});
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

exports.checkCSArchiveStatus = function(csId,callback){
	Archive.find({changeSetId:csId},function(err,archives){
        if(archives){
            var isBreak = false;
            for(var i=0;i<archives.length;i++){
                var archive = archives[i];
                if(archive.status == 'inProcess'){
                    ChangeSet.findByIdAndUpdate(csId,{archiveStatus:'block'},function(err){
                        if(err)callback(err);
                        else callback(null);
                    });
                    isBreak=true;
                    break;
                }
            }
            if(!isBreak){
                ChangeSet.findByIdAndUpdate(csId,{archiveStatus:'none'},function(err){
                    if(err)callback(err);
                    else callback(null);
                });
            }
        }
    });
};

exports.checkCSValidateStatus = function(csId,callback){
	Validation.find({changeSetId:csId},function(err,validations){
		if(validations){
			var isBreak = false;
			for(var i=0;i<validations.length;i++){
				var validation = validations[i];
				if(validation.status == 'inProcess'){
					 ChangeSet.findByIdAndUpdate(csId,{validateStatus:'block'},function(err){
                        if(err)callback(err);
                        else callback(null);
                    });
                    isBreak=true;
                    break;
				}
			}
			if(!isBreak){
				ChangeSet.findByIdAndUpdate(csId,{validateStatus:'none'},function(err){
                    if(err)callback(err);
                    else callback(null);
                });
			}
		}
	});
};

exports.checkCSDeployStatus = function(csId,callback){
	Deployment.find({changeSetId:csId},function(err,deployments){
		if(deployments){
			var isBreak = false;
			for(var i=0;i<deployments.length;i++){
				var deployment = deployments[i];
				if(deployment.status == 'inProcess'){
					 ChangeSet.findByIdAndUpdate(csId,{deployStatus:'block'},function(err){
                        if(err)callback(err);
                        else callback(null);
                    });
                    isBreak=true;
                    break;
				}
			}
			if(!isBreak){
				ChangeSet.findByIdAndUpdate(csId,{deployStatus:'none'},function(err){
                    if(err)callback(err);
                    else callback(null);
                });
			}
		}
	});
};