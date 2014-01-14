
$(document).ready(function(){
	$('#newSFConn .connValidate').bind('click',function(){
		var name = $('#newSFConn').find('#inputName').val();
		var newSFConn={};
		newSFConn.name=$('#newSFConn').find('#connName').val();
		newSFConn.username=$('#newSFConn').find('#inputEmail').val();
		newSFConn.password=$('#newSFConn').find('#inputPassword').val();
		newSFConn.secureToken=$('#newSFConn').find('#inputSecurToken').val();
		newSFConn.conn_env=$('#newSFConn').find('#inputSelect').val();
		if($("#csId").length>0){
			if(name ==null || name == ''){
				$('#newSFConn').find('#inputName').parent().addClass('has-error');
				return;
			}
		}
		if(newSFConn.username == null || newSFConn.username == ''){
			$('#newSFConn').find('#inputEmail').parent().addClass('has-error');
			return;
		}
		if(newSFConn.password == null || newSFConn.password == ''){
			$('#newSFConn').find('#inputPassword').parent().addClass('has-error');
			return;
		}
		if(newSFConn.secureToken == null || newSFConn.secureToken == ''){
			$('#newSFConn').find('#inputSecurToken').parent().addClass('has-error');
			return;
		}
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

	$('#newSFConn input').bind('click',function(){
		$(this).parent().removeClass('has-error');
	});

	$('#newSFConn .form-group:first input:first').each(function(){
		$(this).bind('change',function(){
			$(this).parent().parent().next().find('input').val($(this).parent().parent().next().find('input').val()||$(this).val());
		})
	});

	if($("#csId").length>0){
		$("#newSFConn-csId").val($("#csId").val());
		$('#newSFConn .newSFConnSave').attr("disabled",true);
		$('#newSFConn input').each(function(){
			$(this).bind('change',function(){
				$('#newSFConn .newSFConnSave').attr("disabled",true);
			});
		});
		$('#newSFConn select:first').bind('change',function(){
			$('#newSFConn .newSFConnSave').attr("disabled",true);
		});
	}
});

