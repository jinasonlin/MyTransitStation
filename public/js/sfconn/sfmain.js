/**
 * New node file
 */
var $=jQuery.noConflict();
$(document).ready(function(){
	$('.sfconnEditForm').each(function(){
		var sfconnId=$(this).parent().parent().parent().parent().attr('id');
		var sfconn={};
		$(this).find('.connValidate').bind('click',function(){
			sfconn.name=$('#'+sfconnId).find("input[name='connName']").val();
			sfconn.username=$('#'+sfconnId).find("input[name='username']").val();
			sfconn.password=$('#'+sfconnId).find("input[name='password']").val();
			sfconn.secureToken=$('#'+sfconnId).find("input[name='secureToken']").val();
			sfconn.conn_env=$('#'+sfconnId).find("select[name='endpoint']").val();
			$.post('/sfconn/validate',{
				sfconn:sfconn
			}).done(function(data){
				if('validate'==data){
					$('#'+sfconnId).find('.validInfo').css('display','block');
					$('#'+sfconnId).find('.unValideInfo').css('display','none');
				}else{
					$('#'+sfconnId).find('.validInfo').css('display','none');
					$('#'+sfconnId).find('.unValideInfo').css('display','block');
				}
			});
		});
		$("tr[ref='"+sfconnId+"']").find('.sfconn-cs').bind('click',function(){
			sfconn.name=$('#'+sfconnId).find("input[name='connName']").val();
			sfconn.username=$('#'+sfconnId).find("input[name='username']").val();
			sfconn.password=$('#'+sfconnId).find("input[name='password']").val();
			sfconn.secureToken=$('#'+sfconnId).find("input[name='secureToken']").val();
			sfconn.conn_env=$('#'+sfconnId).find("select[name='endpoint']").val();
			$.post('/sfconn/validate',{
				sfconn:sfconn
			}).done(function(data){
				if('validate'==data){
					window.open("/sfconn/"+sfconnId,"_self");
				}else{
					$('#'+sfconnId).find('.unValideInfo').css('display','block');
					$("#"+sfconnId).modal('show');
				}
			});
		});
		$("tr[ref='"+sfconnId+"']").find('.sfconn-sf').bind('click',function(){
			sfconn.name=$('#'+sfconnId).find("input[name='connName']").val();
			sfconn.username=$('#'+sfconnId).find("input[name='username']").val();
			sfconn.password=$('#'+sfconnId).find("input[name='password']").val();
			sfconn.secureToken=$('#'+sfconnId).find("input[name='secureToken']").val();
			sfconn.conn_env=$('#'+sfconnId).find("select[name='endpoint']").val();
			$.post('/sfconn/syncFile/'+sfconnId).done(function (data) {
				if('done' == data){
					window.open("/sfconn","_self");
				}	
			});
			/*$.post('/sfconn/validate',{
				sfconn:sfconn
			}).done(function(data){
				if('validate'==data){
					$.post('/sfconn/syncFile/'+sfconnId);
				}else{
					$('#'+sfconnId).find('.unValideInfo').css('display','block');
					$("#"+sfconnId).modal('show');
				}
			});*/
		});
		$("tr[ref='"+sfconnId+"']").find('.sfconn-del').bind('click',function(){
			$.post('/sfconn/'+sfconnId,{_method:'delete'}).done(function(data){
				if('done' == data){
					window.open("/sfconn","_self");
				}
			});
		});
	});

	$("#single-select a:first").bind("click",function(){
		var loginUrl = 'https://login.salesforce.com/';
		var clientId = '3MVG9Y6d_Btp4xp7ZOesaztHpuKJTdGVM86i1KD.CafBzBowRXP0mAs_oSTxvQrJRXJMVh3pT1oDaLMe7D_Nh';
		var	redirectUri = 'http://localhost:5000/authcallback';
		$("#popupWindow").popupWindow({
	        windowURL: getAuthorizeUrl(loginUrl, clientId, redirectUri),
	        windowName: 'Connect',
	        centerBrowser: 1,
	        height: 524,
	        width: 675
	    });
	    $("#popupWindow").trigger('click');
	});

	$("#single-select a:last").bind("click",function(){
		var loginUrl = 'https://test.salesforce.com/';
		var clientId = '3MVG9A2kN3Bn17huLzcysKVpjdfzblwRb4UArmn8iNYIAykHugRL76dwTzlY9ryzUqTBdxSGypMLbbkYGmdA.';
		var	redirectUri = 'http://localhost:8888/testforOauth/oauthcallback.html';
		$("#popupWindow").popupWindow({
	        windowURL: getAuthorizeUrl(loginUrl, clientId, redirectUri),
	        windowName: 'Connect',
	        centerBrowser: 1,
	        height: 524,
	        width: 675
	    });
	    $("#popupWindow").trigger('click');
	});
});

function getAuthorizeUrl(loginUrl, clientId, redirectUri){
	return loginUrl+'services/oauth2/authorize?display=popup'
        +'&response_type=token&client_id='+escape(clientId)
        +'&redirect_uri='+escape(redirectUri);
}

function sessionCallback(oauthResponse) {
	console.log("sessionCallback");
	console.log(oauthResponse);

	var splitToken = oauthResponse.access_token.split("!");
	var splitId = oauthResponse.id.split("/");
	var sfconn={};
	sfconn.sid = oauthResponse.access_token;
	sfconn.userId = splitId[splitId.length - 1];
	sfconn.endpoint = oauthResponse.instance_url + "/services/Soap/u/29.0/" + splitToken[0];

	console.log(sfconn);

	$.post('/sfconn', sfconn)
		.done(function(data){
			//console.log(data);
			if('done' == data){
				window.open("/sfconn","_self");
			}
		});
}