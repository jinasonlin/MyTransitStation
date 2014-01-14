
$(document).ready(function(){
	$('#newSFConn .connValidate').bind('click',function(){
		console.log($("#triggle-name").val());
		var newSFConn={};
		newSFConn.name=$('#newSFConn').find('#connName').val();
		newSFConn.username=$('#newSFConn').find('#inputEmail').val();
		newSFConn.password=$('#newSFConn').find('#inputPassword').val();
		newSFConn.secureToken=$('#newSFConn').find('#inputSecurToken').val();
		newSFConn.conn_env=$('#newSFConn').find('#inputSelect').val();
		$.post('/sfconn/validate',{
			sfconn : newSFConn
		}).done(function(data){
			if('validate'==data){
				$('#newSFConn').find('.validInfo').css('display','block');
				$('#newSFConn').find('.unValideInfo').css('display','none');
				$('#newSFConn .newSFConnSave').attr("disabled",null);
			}else{
				$('#newSFConn').find('.validInfo').css('display','none');
				$('#newSFConn').find('.unValideInfo').css('display','block');
			}
		});
	});

	$('#newSFConn .form-group:first input:first').each(function(){
		$(this).bind('change',function(){
			$(this).parent().parent().next().find('input').val($(this).parent().parent().next().find('input').val()||$(this).val());
		})
	});

	if($("#csId").length>0){
		$('#newSFConn .newSFConnSave').attr("disabled",true);
		$('#newSFConn input').each(function(){
			$(this).bind('change',function(){
				$('#newSFConn .newSFConnSave').attr("disabled",true);
			});
		});
		$('#newSFConn select').bind('change',function(){
			$('#newSFConn .newSFConnSave').attr("disabled",true);
		});
	}
});

