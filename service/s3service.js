'use strict';
var aws = require('aws-sdk'),
	Buffer = require('buffer').Buffer,
	fs = require('fs'),
	CommonService = require('./commonservice');

aws.config.loadFromPath('./aws-config.json');
var S3 = new aws.S3();

var tag = 's3 service : ';

exports.uplaodData = function(fileName,callback){
	var filePath = __dirname + '/../temp/' + fileName;
	var s3Key = fileName.split('_')[0]+'/'+fileName.split('_')[1];
	var archiveId = (fileName.split('_')[1]).split('.')[0];
	if(!S3){
		S3 = new aws.S3();
	}
	S3.headBucket({
		Bucket : 'migrationtool'
	},function(err,migrationtool){
		if(err)console.log(tag + err);
		else{
			if(migrationtool){
				console.log(tag + 'migrationtool exist');
				fs.readFile(filePath,{encoding : 'base64'},function(err,data){
					if(err) callback(err);
					else {
						console.log(tag + 'begin to do file save to s3 . file length : '+data.length);
						var buff = new Buffer(data,'base64');
						var opts = {
							ACL : 'public-read',
							Bucket : 'migrationtool',
							Key : s3Key,
							Body : buff ,
							ContentEncoding :'base64'
						};
						console.log(tag + 'begin to put file to s3');
						S3.putObject(opts,function(err,data){
							if(err)callback(err);
							else{
								console.log(tag + 'save file to s3 done');
								callback(null,opts.key);
								fs.unlinkSync(filePath);
								buff.fill('');
								console.log(tag + 'delete temp file ' + filePath);
								opts = null;
							}
						});
					}
				});
			}
		}
	});
};

exports.downloadData = function(s3key,callback){
	var path = __dirname + '/../temp';
	if(!S3){
		S3 = new aws.S3();
	}
	S3.headBucket({
		Bucket : 'migrationtool'
	},function(err,migrationtool){
		if(err){
			console.log(tag + err);
			callback(err);
		}else{
			if(migrationtool){
				console.log(tag + 'migrationtool exist');
				var opts = {
					Bucket : 'migrationtool',
					Key : s3key,
					ResponseContentEncoding :'base64'
				};
				console.log(tag + 'begin to doload file '+ s3key +' from s3');
				S3.putObject(opts,function(err,data){
					if(err) {
						callback(err);
					} else {
						CommonService.confirmDirExists(path, function(err,data){
							if(err) {
								callback(err);
							} else {
								fs.writeFile(path + '/' + s3key.split('\/').jion('_'), {encoding:'base64'}, function(err){
									if(err) callback(err);
									else callback(null,'FilePrepared');
								});
							}
						});
					}
				});
			}
		}
	});
};