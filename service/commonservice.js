var fs = require('fs'),
	nodeforce = require("../lib/nodeforce");

exports.confirmDirExists = function(path,callback){
	fs.existsSync(path,function(exists){
		if(exists){
			callback(null,'exists');
		}else{
			fs.mkdirSync(path,function(err){
				if(err) callback(err);
				else callback(null,'exists');
			});
		}
	});
};

exports.checkFileExists = function(path,callback){
	var rootPath = fs.realpathSync('.');
	var filePath = rootPath + path;
	console.log('check '+ filePath +' exists or not');
	fs.exists(filePath,function(exists){
		if(exists){
			console.log(filePath+' exist');
			callback(null)
		}else {
			console.log(filePath+' not exist');
			callback('Notexist');
		}
	});
};

exports.connect2SFDC = function(sfconn,callback){
	var client = nodeforce.createClient({
		username : sfconn.username,
		password : sfconn.password + sfconn.secureToken,
		endpoint : sfconn.conn_env
	});
	client.login(function(err,response,request){
		if(client.userId){
			callback(null,client);
		}else{
			callback('err',null);
		}
	});
};