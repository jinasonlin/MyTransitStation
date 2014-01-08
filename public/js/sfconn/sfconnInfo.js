var $=jQuery.noConflict();

$(document).ready(function(){
	$('table td button.btn-warning').each(function(){
		var csId = $(this).parent().parent().attr('id');
		var sfconnId = $("#sfconnId").val();
		$(this).bind('click',function(){
			$.post('/sfconn/'+sfconnId+'/changeSets/'+csId,{_method : 'delete'}).done(function(data){
				if('done'==data){
					location.reload(true);
				}
			});
		});
	});
});