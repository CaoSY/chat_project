$(document).ready(function() {
	$("form").submit(function(event) {
		$('.form-warning').remove();
		var correctUserName = validateInput($("input[type=text]"), /^[\w|\d](\s*[\w|\d])+$/, "Only letters, digits and inner spaces allowed.");
		var correctPassWord = validateInput($("input[type=password]"), /^[\w|\d]+$/, "Only letters and digits allowed.");
		var correctProfile = validateInput($("input[type=file]"), /[.jpg|.png|.gif]$/, "Only jpg, gif or png allowed");
		//return correctUserName && correctPassWord && correctProfile;
		if(correctUserName && correctPassWord && correctProfile) {
			$.post("register.php", $("form").serialize()).done(function(data) {
				var response = $($.parseXML(data));
				var sucess = response.find("result sucess").text() == "true";
				if(sucess) {
					var reminder = $("<span class='help-block'>Register successfully. Jump in 2 seconds</span>");
					$("form h2").after(reminder);
					$("form button").prop("disabled", true);
					$("form input").prop("disabled", true);
					setTimeout(function() {
						reminder.text("Register successfully. Jump in 1 seconds");
						setTimeout('window.location = "index.html"', 1000);
					}, 1000);
				}else {
					$("form h2").after($(`<span class='help-block form-warning'>${response.find('result info').text()}</span>`));
				}
			}).fail(function() {
				$("form h2").after($("<span class='help-block form-warning'>Connection failed. Please try again</span>"));
			});
		}
		event.preventDefault();
	});
	$("input[type=file]").on("change", function() {
		if(validateInput($("input[type=file]"), /[.jpg|.png|.gif]$/, "Only jpg, gif or png allowed")) {
			$("#image-holder").empty();
			var reader = new FileReader();
			reader.onload = function(e) {
				$("<img />", {
					"src": e.target.result,
					"class": "thumb-image"
				}).appendTo($("#image-holder"));
			};
			reader.readAsDataURL($(this)[0].files[0]);
		}
	});
});