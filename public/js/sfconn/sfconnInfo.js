var $=jQuery.noConflict();

$(document).ready(function(){
	initArchiveBtnAction();
	initDeleteBtnAction();
	initDeployAndVlidateAction();
});

function initDeployAndVlidateAction(){
	$("tbody tr").each(function(){
		var csId = $(this).attr('id');
		$(this).find('td:last button.validate').bind('click',function(){
			$("#newSFConn-csId").val(csId);
			$("#triggle-name").val('validation');
		});
		$(this).find('button.deploy').bind('click',function(){
			$("#newSFConn-csId").val(csId);
			$("#triggle-name").val('deployment');
		});
	});
}

function initArchiveBtnAction(){
	$('table td button.archive').each(function(){
		var csId = $(this).parent().parent().attr('id');
		$(this).bind('click',function(){
			$("#single-name input.targetCSId").val(csId);
		});
	});
}

function initDeleteBtnAction(){
	$('table td button.delete').each(function(){
		var csId = $(this).parent().parent().attr('id');
		var sfconnId = $("#sfconnId").val();
		$(this).bind('click',function(){
			$(".container").spin(opts);
			$.post('/sfconn/'+sfconnId+'/changeSets/'+csId,{_method : 'delete'}).done(function(data){
				$(".container").spin(false);
				if('done'==data){
					location.reload(true);
				}
			});
		});
	});
}

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