var $=jQuery.noConflict();

$(document).ready(function(){
	$("li[mode='pack'] .controlBtn").each(function(){
		var ref = $(this).parent().parent().attr('ref');
		$(this).bind('click',function(){
			if($(this).hasClass('controlFold')){
				$(this).removeClass('controlFold').addClass('controlUnFold');
				$(this).children().removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
				$("li[ref='"+ref+"'][mode='file']").show();
			}else if($(this).hasClass('controlUnFold')){
				$(this).removeClass('controlUnFold').addClass('controlFold');
				$(this).children().removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
				$("li[ref='"+ref+"'][mode='file']").hide();
			}
		});
	});
});