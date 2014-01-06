var nodeforce = require("../lib/nodeforce"),
 	SFConnection = require("../model/sfconnection");

exports.listSFConn = function(req,res){
	var testConnections=[
	{
		id : '1',
		name : 'Fred',
		username : '123@itb.com',
		password : '12121212',
		secureToken : '131dasdasd',
		conn_env : 'login.salesforce.com',
		createdBy : '9501'
	},
	{
		id : '2',
		name : 'James',
		username : '123@itb.com',
		password : '12121212',
		secureToken : '131dasdasd',
		conn_env : 'test.salesforce.com',
		createdBy : '9501'
	},{
		id : '3',
		name : 'Hary',
		username : '123@itb.com',
		password : '12121212',
		secureToken : '131dasdasd',
		conn_env : 'test.salesforce.com',
		createdBy : '9501'
	},{
		id : '4',
		name : 'Tom',
		username : '123@itb.com',
		password : '12121212',
		secureToken : '131dasdasd',
		conn_env : 'test.salesforce.com',
		createdBy : '9501'
	}];
	SFConnection.find(function(err,SFConnections){
		if(err)res.render('sfconnection/sfconnManage',{
			err:err,
			SFConnections:testConnections,
			userId:'9501'
		});
		else res.render('sfconnection/sfconnManage',{
			SFConnections:testConnections,
			userId:'9501'
		});
	})
};

exports.addSFConn = function(req,res){
	console.log(req.body);
	var newSFConn=req.body;
	var isStore=req.body.isStore;
	if(req.body.username){
		new SFConnection({
			name : newSFConn.connName,
			username : newSFConn.username,
			password : newSFConn.password,
			secureToken : newSFConn.secureToken,
			conn_env : newSFConn.conn_env,
			createdBy : 'test_user_id'
		}).save(function(err,SFConnection){
			if(err) res.redirect('/sfconn',{errMessage : 'Save Error'});
			else res.redirect('/sfconn/1');
		});
	}else{
		res.redirect('/sfconn');
	}
	
};

exports.deleteSFConn = function(req,res){
	var sfconnId = req.body.sfconnId;
	SFConnection.remove({
		id : sfconnId
	},function(err){
		if(err)res.send({err:err});
		else res.redirect('/sfconn');
	})
};

exports.signInSFConn = function(req,res){
	if(req.params.sfconnId&&req.params.sfconnId==1){
		res.render('sfconnection/sfconnInfo',{
			title : 'SFConnection | Test',
			connName : 'test name'
		})
	}else{
		res.redirect('/sfconn');
	}
};

exports.updateSFConn = function(req,res){
	var sfconnId=req.params.sfconnId;
	console.log(req.body);
	res.redirect('/sfconn');
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
	      res.send("validate");
	    } else {
	      res.send("unValidate");
	    }
	  });
};