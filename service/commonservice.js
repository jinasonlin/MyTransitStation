"use strict";
var fs = require("fs"),
	nodeforce = require("../lib/nodeforce");

exports.confirmDirExists = function(path,callback){
	if (fs.existsSync(path)) {
		callback(true, "path is exists");
	} else {
		fs.mkdirSync(path, "0755");
		if (fs.existsSync(path)) {
			callback(true, "new path succes");
		} else {
			callback(false, "new path failure");
		}
	}
};

exports.checkFileExists = function(path,callback){
	if (fs.existsSync(path)) {
		callback(true, "path is exists");
	} else {
		callback(false, "path is not exists");
	}
};

exports.connectSFDC = function (data, callback) {
	var client = nodeforce.createClient({
		    sid: data.sid,
		    userId: data.userId,
		    endpoint: data.endpoint
	});
	client.login(function(err, response, lastRequest) {
	    if (client.userId) {
			callback(null,client);
	    } else {
			callback(err,null);
	    }
	});
};

exports.STATICS = {
	datefmt : "YYYY-MM-DD HH:mm:ss"
};