$(document).ready(function() {
	for(let i=0; i<20; ++i) {
		$("#contact-list").append($(`<div class="contact-list-item"><div class="avatar"><img src="img/default-user-image.svg" class="item-img img-circle center-block" /></div><div class="item-body"><div class="item-title"><p class="item-name">sed do eiusmod tempo</p></div><div class="item-info">world</div></div></div>`));
		$("#edit-helper").children().tooltip({
			animation: true,
			container: "body",
			delay: {
				show: 100,
				hide: 0
			},
			trigger: "hover",
			placement: "top",
		});
		$(".search-icon").hover(function() {
			console.log("hover");
		});
	}
});

function formatDate(dateObj) {
	var year = dateObj.getFullYear();
	var month = dateObj.getMonth() + 1;
	var date = dateObj.getDate();
	return `${year}/${month}/${date}`;
}

function randomRGB() {
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	return `rgb(${r},${g},${b})`;
}