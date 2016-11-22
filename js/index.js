$(document).ready(function() {
	$("form").submit(function(event) {
		$('.form-warning').remove();
		var correctUserName = validateInput($("input[type=text]"), /^[\w|\d](\s*[\w|\d])+$/, "Only letters, digits and inner spaces allowed.");
		var correctPassWord = validateInput($("input[type=password]"), /^[\w|\d]+$/, "Only letters and digits allowed.");
		if(correctUserName && correctPassWord) {
			$.post("authenticate.php", $("form").serialize()).done(function(data) {
				var response = $($.parseXML(data));
				var pass = response.find("auth pass").text() == "true";
				if(pass) {
					console.log(response.find("auth info name").text());
				}else {
					$("form h2").after($("<span class='help-block form-warning'>User name or password is incorrect.</span>"));
				}
			}).fail(function() {
				$("form h2").after($("<span class='help-block form-warning'>Connection failed. Please try again</span>"));
			});
		}
		event.preventDefault();
	});
});