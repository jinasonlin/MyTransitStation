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
		$('#single-name input.targetCSId').val(csId);
	});

	$('button.validate').bind('click',function(){
		$("#triggle-name").val("validation");
	});

	$('button.deploy').bind('click',function(){
		$("#triggle-name").val("deployment");
	});

	$('button.archive-drop').bind('click',function(){
		$(".container").spin(opts);
		var itemId = $(this).parent().parent().attr('id');
		$.post('/changeSet/archive/'+itemId,{_method:'delete'}).done(function(data){
			$(".container").spin(false);
			if('done'==data){
				location.reload(true);
			}else{
				$(".row.alert.archive-alert").addClass('alert-danger');
				$(".row.alert.archive-alert").text(data);
				$(".row.alert.archive-alert").show();
				$(".row.alert.archive-alert").fadeOut(6000);
			}
		});
	});

	$('button.validation-drop').bind('click',function(){
		$(".container").spin(opts);
		var itemId = $(this).parent().parent().attr('id');
		$.post('/changeSet/validation/'+itemId,{_method:'delete'}).done(function(data){
			$(".container").spin(false);
			if('done'==data){
				location.reload(true);
			}else{
				$(".row.alert.validate-alert").addClass('alert-danger');
				$(".row.alert.validate-alert").text(data);
				$(".row.alert.validate-alert").show();
				$(".row.alert.validate-alert").fadeOut(6000);
			}
		});
	});

	$('button.deployment-drop').bind('click',function(){
		$(".container").spin(opts);
		var itemId = $(this).parent().parent().attr('id');
		$.post('/changeSet/deployment/'+itemId,{_method:'delete'}).done(function(data){
			$(".container").spin(false);
			if('done'==data){
				location.reload(true);
			}else{
				$(".row.alert.deploy-alert").addClass('alert-danger');
				$(".row.alert.deploy-alert").text(data);
				$(".row.alert.deploy-alert").show();
				$(".row.alert.deploy-alert").fadeOut(6000);
			}
		});
	});

	$("#single-select a:first").bind('click',function(){
		$("#sfconn-select").modal('show');		
	});
	$("#single-select a:last").bind('click',function(){
		$("#newSFConnPanel").modal('show');		
	});

	/******************************* test ***************************/
		$(".archive-validate").bind("click",function(){
			var csId = $("#csId").val();
			var archiveId = $(this).parent().parent().attr("id");
			var data = {
				name : "validation1",
				archiveId : archiveId,
				targetSFConnId : "5302d67b0b99d702008fe7c8" 
			};
			$.post("/changeSets/" + csId+ "/validation", data).done(function (data) {
				if("done" == data){
					location.reload(true);
				}	
			});
		});
		$(".archive-deploy").bind("click",function(){
			var csId = $("#csId").val();
			var archiveId = $(this).parent().parent().attr("id");
			var data = {
				name : "deploy1",
				archiveId : archiveId,
				targetSFConnId : "5302d67b0b99d702008fe7c8" 
			};
			$.post("/changeSets/" + csId+ "/deployment", data).done(function (data) {
				console.log(data);
				if("done" == data){
					location.reload(true);
				}	
			});
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
