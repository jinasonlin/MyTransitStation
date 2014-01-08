/**
 * New node file
 */
var $=jQuery.noConflict();
$(document).ready(function(){
	$('.sfconnEditForm').each(function(){
		var sfconnId=$(this).parent().parent().parent().parent().attr('id');
		var sfconn={};
		sfconn.name=$('#'+sfconnId).find("input[name='connName']").val();
		sfconn.username=$('#'+sfconnId).find("input[name='username']").val();
		sfconn.password=$('#'+sfconnId).find("input[name='password']").val();
		sfconn.secureToken=$('#'+sfconnId).find("input[name='secureToken']").val();
		sfconn.conn_env=$('#'+sfconnId).find("select[name='endpoint']").val();
		$(this).find('.connValidate').bind('click',function(){
			$.post('/sfconn/validate',{
				sfconn:sfconn
			}).done(function(data){
				if('validate'==data){
					$('#'+sfconnId).find('.validInfo').css('display','block');
					$('#'+sfconnId).find('.unValideInfo').css('display','none');
				}else{
					$('#'+sfconnId).find('.validInfo').css('display','none');
					$('#'+sfconnId).find('.unValideInfo').css('display','block');
				}
			});
		});
		$("#"+sfconnId).prev().find('.sfchangeSet').bind('click',function(){
			$.post('/sfconn/validate',{
				sfconn:sfconn
			}).done(function(data){
				if('validate'==data){
					window.open("/sfconn/"+sfconnId,"_self");
				}else{
					$('#'+sfconnId).find('.unValideInfo').css('display','block');
					$("#"+sfconnId).modal('show');
				}
			});
		});
		$("#"+sfconnId).prev().find('.sffileSync').bind('click',function(){
			$.post('/sfconn/validate',{
				sfconn:sfconn
			}).done(function(data){
				if('validate'==data){
					$.post('/sfconn/'+sfconnId+'/syncFile');
				}else{
					$('#'+sfconnId).find('.unValideInfo').css('display','block');
					$("#"+sfconnId).modal('show');
				}
			});
		});
		$("#"+sfconnId).prev().find('.sfconnDelete').bind('click',function(){
			$.post('/sfconn/'+sfconnId,{_method:'delete'}).done(function(data){
				if('done' == data){
					location.reload(true);
				}
			});
		});
	});

	

	$('#newSFConn .connValidate').bind('click',function(){
		var newSFConn={};
		newSFConn.name=$('#newSFConn').find('#connName').val();
		newSFConn.username=$('#newSFConn').find('#inputEmail').val();
		newSFConn.password=$('#newSFConn').find('#inputPassword').val();
		newSFConn.secureToken=$('#newSFConn').find('#inputSecurToken').val();
		newSFConn.conn_env=$('#newSFConn').find('#inputSelect').val();
		console.log(newSFConn);
		$.post('/sfconn/validate',{
			sfconn : newSFConn
		}).done(function(data){
			if('validate'==data){
				$('#newSFConn').find('.validInfo').css('display','block');
				$('#newSFConn').find('.unValideInfo').css('display','none');
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
});