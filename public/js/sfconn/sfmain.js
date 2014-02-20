/**
 * New node file
 */
 "use strict";
var $ = jQuery.noConflict();

$(document).ready(function(){
	$(".sfconnEdit").each(function(){
		var sfconnId=$(this).attr("id");
		var sfconn={};
		$(this).find(".save").bind("click",function(){
			var orgName=$("#"+sfconnId).find("input[name='orgName']").val();
			$.post("/sfconn/"+sfconnId, {
				orgName : orgName,
				_method : "put"
			}).done(function(data){
				if("done" == data){
					window.open("/sfconn","_self");
				}	
			});
		});
		/**
		 * switch user
		 * re auth
		**/
		$("tr[ref='"+sfconnId+"']").find(".sfconn-oauth").bind("click",function(){
			var orgId = $(this).parent().parent().find(".organizationId").attr("id");

			oauthProduction(orgId);

			//oauthSandBox(orgId);
		});

		$("tr[ref='"+sfconnId+"']").find(".sfconn-cs").bind("click",function(){
			sfconn.name=$("#"+sfconnId).find("input[name='connName']").val();
			sfconn.username=$("#"+sfconnId).find("input[name='username']").val();
			sfconn.password=$("#"+sfconnId).find("input[name='password']").val();
			sfconn.secureToken=$("#"+sfconnId).find("input[name='secureToken']").val();
			sfconn.conn_env=$("#"+sfconnId).find("select[name='endpoint']").val();
			$.post("/sfconn/validate",{
				sfconn:sfconn
			}).done(function(data){
				if("validate"==data){
					window.open("/sfconn/"+sfconnId,"_self");
				}else{
					$("#"+sfconnId).find(".unValideInfo").css("display","block");
					$("#"+sfconnId).modal("show");
				}
			});
		});
		$("tr[ref='"+sfconnId+"']").find(".sfconn-sf").bind("click",function(){
			sfconn.name=$("#"+sfconnId).find("input[name='connName']").val();
			sfconn.username=$("#"+sfconnId).find("input[name='username']").val();
			sfconn.password=$("#"+sfconnId).find("input[name='password']").val();
			sfconn.secureToken=$("#"+sfconnId).find("input[name='secureToken']").val();
			sfconn.conn_env=$("#"+sfconnId).find("select[name='endpoint']").val();
			$.post("/sfconn/syncFile/"+sfconnId).done(function (data) {
				if("done" == data){
					window.open("/sfconn","_self");
				}	
			});
			/*$.post("/sfconn/validate",{
				sfconn:sfconn
			}).done(function(data){
				if("validate"==data){
					$.post("/sfconn/syncFile/"+sfconnId);
				}else{
					$("#"+sfconnId).find(".unValideInfo").css("display","block");
					$("#"+sfconnId).modal("show");
				}
			});*/
		});
		$("tr[ref='"+sfconnId+"']").find(".sfconn-del").bind("click",function(){
			$.post("/sfconn/"+sfconnId,{_method:"delete"}).done(function(data){
				if("done" == data){
					window.open("/sfconn","_self");
				}
			});
		});
	});
});