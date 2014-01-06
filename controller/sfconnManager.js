var nodeforce = require("../lib/nodeforce"),
 	SFConnection = require("../model/sfconnection");

exports.listSFConn = function(req,res){
	SFConnection.find(function(err,SFConnections){
		if(err){
			res.render('sfconnection/sfconnManage',{
				err:err,
				SFConnections:[],
				userId:'9501'
			});
		}else res.render('sfconnection/sfconnManage',{
			SFConnections:SFConnections,
			userId:'9501'
		});
	})
};

exports.addSFConn = function(req,res){
	console.log(req.body);
	var newSFConn={
		name : req.body.connName,
		username : '',
		password : '',
		secureToken : '',
		endpoint : ''
	};
	var isStore=req.body.isStore;
	if('on' == isStore){
		newSFConn.username = req.body.username;
		newSFConn.password = req.body.password;
		newSFConn.secureToken = req.body.secureToken;
		newSFConn.conn_env = req.body.endpoint;
	}
	new SFConnection(newSFConn).save(function(err,docs){
		if(err) res.send({errMessage : 'Save Error'});
		else res.redirect('/sfconn');
	});
};

exports.deleteSFConn = function(req,res){
	var sfconnId = req.params.sfconnId;
	console.log(sfconnId);
	SFConnection.findByIdAndRemove(sfconnId,function(err){
		if(err)res.send({errMessage:err});
		else {
			res.send(null);
			res.redirect('/sfconn');
		}
	})
};

exports.listSFConnInfo = function(req,res){
	var sfconnId = req.params.sfconnId;
	var sfconnInfo = SFConnection.findById(sfconnId,function(err,docs){
		if(!err){
			global.sfclient = nodeforce.createClient({
				username : docs.username,
				password : docs.password + docs.secureToken,
				endpoint : docs.conn_env
			});
	  		global.sfclient.login(function(err, response, lastRequest) {
	    		if (global.sfclient.userId) {
	    			global.sfconn = docs;
			      	res.render('sfconnection/sfconnInfo',{
						title : 'SFConnection',
						sfconn : docs
					});
	    		} else {
			      res.redirect("/sfconn?errMessage=Login failed, please check your SFConnection username and password!");
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
	console.log(req.body);
	console.log(sfconnId);
	console.log(updataSFConn);
	SFConnection.findByIdAndUpdate(sfconnId,updataSFConn,function(err){
		res.redirect('/sfconn');
	});
};

exports.validateSFConn = function(req,res){
	console.log(req.body);
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
	res.redirect('/sfconn');
}

exports.changeSetInit = function(req,res){
	global.sfclient.describe(function(err,response,request){
		var metas=[];
		if(response.result && response.result.metadataObjects){
			metas = response.result.metadataObjects;
		}
		res.render('sfconnection/newChangeSet', {
			title : 'SFConnection',
			sfconn : global.sfconn,
			metas : metas
		});
	});
};

exports.changeSetNew = function(req,res){

};


exports.changeSetEdit = function(req,res){

};


exports.changeSetDelete = function(req,res){

};


exports.changeSetInfo = function(req,res){

};
