$(document).ready(function(){
	$("#sfconn-select input:radio").each(function(){
		$(this).bind('click',function(){
			var _this = $(this)[0];
			$("#sfconn-select .choosedSFConn").text($(this).parent().text());
			$("#sfconn-select input:radio").each(function(){
				if($(this)[0]!=_this){
					$(this).attr('checked',false);
				}
			});
		});
	});
});