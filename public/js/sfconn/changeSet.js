var $=jQuery.noConflict();

$(document).ready(function(){
	$('.controlBtn').each(function(){
		$(this).bind('click',function(){
			var ref = $(this).parent().parent().attr('ref');
			if($(this).hasClass('controlFold')){
				$(this).removeClass('controlFold').addClass('controlUnFold');
				$(this).find('span').removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
				$("li[ref='"+ref+"'][mode='metaObjectChild']").show();
			}else if($(this).hasClass('controlUnFold')){
				$(this).removeClass('controlUnFold').addClass('controlFold');
				$(this).find('span').removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
				$("li[ref='"+ref+"'][mode='metaObjectChild']").hide();
			}
		})
	});

	$("input[mode='metaObjectAllCheck']").each(function(){
		var ref=$(this).parent().parent().parent().attr('ref');
		$(this).bind('click',function(){
			if(ref){
				if($(this)[0].checked){
					$("input[ref='"+ref+"'][mode='metaFile']").each(function(){
						$(this)[0].checked=true;
					});
				}else{
					$("input[ref='"+ref+"'][mode='metaFile']").each(function(){
						$(this)[0].checked=false;
					});
				}
			}
		});
	});

	$("#newCSSaveBtn").bind('click',function(){
		var selectFiles = [];
		var csName = $("#changeSetName").val();
		if($("input[mode='metaFile']:checked").length==0){
			$("#warning").children().text("No file checked.");
			$("#warning").show();
			$("#warning").fadeOut(4000);
		}else{
			$("input[mode='metaFile']:checked").each(function(){
				selectFiles.push($(this).next().text()); 
			});
		}
		if(csName =='' || csName == null){
			$("#warning").children().text("Please fill up the Changeset name");
			$("#warning").show();
			$("#warning").fadeOut(3000);
		}
		if(selectFiles && selectFiles.length>0 && csName!='' && csName != null){
			var req_url = "/sfconn/"+$("#sfconnId").val()+"/changeSets";
			if(location.search.indexOf('csId')>-1){
				req_url += location.search;
			}
			$.post(req_url,{
				selectFiles : selectFiles,
				csName : $("#changeSetName").val()
			},function(data){
				if("done"==data.message){
					window.open("/sfconn/"+$("#sfconnId").val()+"/changeSets/"+data.csId,"_self");
				}else{
					$("#errMessage").text("ERROR! "+data.message);
					$("#errMessage").show();
				}
			});
		}
	});
});