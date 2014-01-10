var aws = require('aws-sdk'),
	changesetservice = require('./changesetservice'),
	Buffer = require('buffer').Buffer
	fs = require('fs'),
	CommonService = require('./commonservice');

aws.config.loadFromPath('./aws-config.json');
var S3 = new aws.S3();

exports.uplaodData = function(fileName,callback){
	var filePath = './temp/' + fileName;
	var s3Key = fileName.split('_')[0]+'/'+fileName.split('_')[1];
	var archiveId = (fileName.split('_')[1]).split('.')[0];
	if(!S3){
		S3 = new aws.S3();
	}
	S3.headBucket({
		Bucket : 'migrationtool'
	},function(err,migrationtool){
		if(err)console.log(err);
		else{
			if(migrationtool){
				console.log('migrationtool exist');
				fs.readFile(filePath,{encoding : 'base64'},function(err,data){
					if(err) callback(err);
					else {
						console.log('begin to do file save to s3 . file length : '+data.length);
						var buff = new Buffer(data,'base64');
						var opts = {
							Bucket : 'migrationtool',
							Key : s3Key,
							Body : buff ,
							ContentEncoding :'base64'
						};
						console.log('begin to put file to s3');
						S3.putObject(opts,function(err,data){
							if(err)callback(err);
							else{
								callback(null,opts.key);
								console.log('save file to s3 done');
								fs.unlinkSync(filePath);
								buff.fill('');
								console.log('delete temp file ' + filePath);
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
	if(!S3){
		S3 = new aws.S3();
	}
	S3.headBucket({
		Bucket : 'migrationtool'
	},function(err,migrationtool){
		if(err)console.log(err);
		else{
			if(migrationtool){
				console.log('migrationtool exist');
				var opts = {
					Bucket : 'migrationtool',
					Key : s3Key,
					ResponseContentEncoding :'base64'
				};
				console.log('begin to doload file '+ s3key +' from s3');
				S3.putObject(opts,function(err,data){
					if(err)console.log(err);
					else{
						CommonService.confirmDirExists('./temp',function(err,data){
							if(err) callback(err);
							else{
								fs.writeFile('./temp/'+s3key.split('\/').jion('_'),{encoding:'base64'},function(err){
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
}