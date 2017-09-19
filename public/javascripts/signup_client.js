$(function() {
  var validation = false;
  $('form').on('submit', function(e){
    if(!validation){
      e.preventDefault();
      $.post('/signup', {
				'username': $("input[name='username']").val(),
				'password': $("input[name='password']").val()
			}, function(data, textStatus, jqXHR) {
			  if(data.stat === 'ok'){
			    //user created, redirect or something
			    validation = true;
			    $('form').submit();
			  }else{
			    //user already exists
			    $('.user_message').html('<div class="w3-panel w3-pale-yellow w3-border w3-border-yellow"><p>This user already exist!</p></div>');
			  }
			});
    }
  });
});

