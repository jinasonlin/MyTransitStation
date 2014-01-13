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

	$('button.archive').bind('click',function(){
		var csId = $("#csId").val();
		$(".container").spin(opts);
		$.post('/changeSets/'+csId+'/archives').done(function(data){
			$(".container").spin(false);
			if('done'==data){
				location.reload(true);
			}else{
				$(".row.alert").addClass('alert-danger');
				$(".row.alert").text(data);
				$(".row.alert").show();
				$(".row.alert").fadeOut(10000);
			}
		});
	});

	$('button.validate').bind('click',function(){
		$("#triggle-name").val("validation");
	});

	$('button.deploy').bind('click',function(){
		$("#triggle-name").val("deployment");
	});
});

var opts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};