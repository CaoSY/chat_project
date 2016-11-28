$(document).ready(function() {
	$("form").submit(function(event) {
		$('.form-warning').remove();
		var correctUserName = validateInput($("input[type=text]"), /^[\w|\d](\s*[\w|\d])+$/, "Only letters, digits and inner spaces allowed.");
		var correctPassWord = validateInput($("input[type=password]"), /^[\w|\d]+$/, "Only letters and digits allowed.");
		var correctProfile = validateInput($("input[type=file]"), /[.jpg|.png|.gif]$/, "Only jpg, gif or png allowed");
		if(correctUserName && correctPassWord && correctProfile) {
			$.ajax({
				url: $(this).attr('action'),
				type: $(this).attr('method'),
				data: new FormData(this),
				async: true,
				cache: false,
				contentType: false,
				processData: false
			}).done(function(data) {
				console.log(data);
				var response = $($.parseXML(data));
				var sucess = response.find("result sucess").text() == "true";
				if(sucess) {
					var reminder = $("<span class='help-block' id='countdown'></span>");
					$("form h2").after(reminder);
					$("form button").prop("disabled", true);
					$("form input").prop("disabled", true);
					countDownAndJump(5);
				}else {
					$("form h2").after($(`<span class='help-block form-warning'>${response.find('result error').text()}</span>`));
				}
				$("input[type=text]").val("");
				$("input[type=password]").val("");
			}).fail(function(error) {
				$("form h2").after($("<span class='help-block form-warning'>Connection failed. Please try again</span>"));
			});
		}
		event.preventDefault();
		
	});
	$("input[type=file]").on("change", function() {
		$(this).nextAll('.form-warning').remove();
		if(validateInput($("input[type=file]"), /[.jpg|.png|.gif|.svg]$/, "Only jpg, gif, png, svg allowed") && this.files.length>0) {
			var maxFileSize = 1<<20;	// 2M
			if(this.files[0].size > maxFileSize)
				$("input[type=file]").after("<span class='help-block form-warning'>File size should be smaller than 2M.</span>")
			else {
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
		}
	});
});

function countDownAndJump(value) {
	if(value > 0) {
		$('#countdown').text(`Register successfully. Jump in ${value} seconds`);
		value -= 1;
		setTimeout(countDownAndJump, 1000, value);
	}else {
		window.location = "index.html";
	}
}