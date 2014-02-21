"use strict";
$(document).ready(function(){
	$("#sfconn-select input:radio").each(function(){
		$(this).bind("click",function(){
			var _this = $(this)[0];
			$("#sfconn-select .choosedSFConn").text($(this).parent().text());
			$("#sfconn-select .choosedSFConn").val($(this).val());
			$("#sfconn-select input:radio").each(function(){
				if($(this)[0]!=_this){
					$(this).attr("checked",false);
				}
			});
		});
	});
	$("#sfconn-select .new").bind("click", function () {
		console.log("click new " + $("#archiveId").val());
		var csId = $("#csId").val();
		var data = {
			name : $("#sfconn-select .name").val(),
			archiveId : $("#archiveId").val(),
			targetSFConnId : $("#sfconn-select .choosedSFConn").val()
		};
		console.log(data);
		/*$.post("/changeSets/" + csId+ "/validation", data).done(function (data) {
			if("done" == data){
				location.reload(true);
			}	
		});*/
	});
	$("#sfconn-select .submit").bind("click", function () {
		console.log("click submit " + $("#archiveId").val());
		var csId = $("#csId").val();
		var data = {
			name : $("#sfconn-select .name").val(),
			archiveId : $("#archiveid").val(),
			targetSFConnId : $("#sfconn-select .choosedSFConn").val()
		};
		$.post("/changeSets/" + csId+ "/validation", data).done(function (data) {
			if("done" == data){
				location.reload(true);
			} else {
				console.log(data);
			}
		});
	});
});