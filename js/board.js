$(document).ready(function () {
	for (let i = 0; i < 20; ++i) {
		$("#contact-list").append($(`<div class="contact-list-item"><div class="avatar"><img src="img/default-user-image.svg" class="item-img img-circle center-block" /></div><div class="item-body"><div class="item-title"><p class="item-name">sed do eiusmod tempo</p></div><div class="item-info">world</div></div></div>`));
		$('[data-toggle="tooltip"]').tooltip({
			animation: true,
			container: "body",
			delay: {
				show: 100,
				hide: 0
			},
			trigger: "hover",
			placement: "top",
		});
	};

	fontList.forEach(function (currentValue) {
		this.append($(`<li><a style='font-family:${currentValue.value}'>${currentValue.name}</a></li>`));
	}, $('[aria-labelledby="font-button"]'));
	$('[aria-labelledby="font-button"] li a').click(function (evtObj) {
		$('#edit-content').css('font-family', $(evtObj.target).css('font-family'));
	});

	weightList.forEach(function (currentValue) {
		this.append(`<li><a style="font-weight:${currentValue.value}">${currentValue.name}</a></li>`);
	}, $('[aria-labelledby="bold-button"]'));
	$('[aria-labelledby="bold-button"] li a').click(function (evtObj) {
		$('#edit-content').css('font-weight', $(evtObj.target).css('font-weight'));
	});

	$('#italic-button').click(function () {
		if ($('#edit-content').css('font-style') == 'italic')
			$('#edit-content').css('font-style', 'normal');
		else
			$('#edit-content').css('font-style', 'italic');
	});

	sizeList.forEach(function (currentValue) {
		this.append($(`<li><a style="font-size:${currentValue.value}">${currentValue.name}</a></li>`))
	}, $('[aria-labelledby="size-button"]'));
	$('[aria-labelledby="size-button"] li a').click(function (evtObj) {
		$('#edit-content').css('font-size', $(evtObj.target).css('font-size'));
	});

	$('[aria-labelledby="color-button"] li a').click(function (evtObj) {
		$('#edit-content').css('color', $(evtObj.target).css('color'));
	});
	$('[aria-labelledby="background-button"] li a').click(function (evtObj) {
		$('#edit-content').css('background-color', $(evtObj.target).css('background-color'));
	});
	$('#edit-content').on('paste', function(evtObj) {
		setTimeout(function() {
			var str = $('#edit-content').text();
			$('#edit-content').empty().text(str);
		}, 0);
	});

	$('#send').click(function() {
		console.log('send');
		var content = $('#edit-content').html();
		console.log(content);
		if(content.match(/^[<br>|<br/>|<br />]*$/)) {
			addMessageToList(createSystemNotification("content can't be blank"));
		}else {
			var msgOut = generateMessageOut();
			addMessageToList(createMessageOut(msgOut));
		}
	});
});


function addMessageToList(msg) {
	var messageList = $('.message-list');
	var scrollToBottom = false;
	if(messageList.height() + messageList.scrollTop() >= messageList.prop('scrollHeight')-10)
		scrollToBottom = true;
	if(Array.isArray(msg)) {
		msg.forEach(function(currentValue) {
			this.append(currentValue);
		}, messageList);
	}else {
		messageList.append(msg);
	}
	if(scrollToBottom)
		messageList.animate({scrollTop: messageList.prop("scrollHeight")}, 500);
}
function createSystemNotification(msgStr) {
	return $(`<div class="message"><div class="system-message-body"><span class="system-notification">${msgStr}</span></div></div>`);
}
function generateMessageOut() {
	var copyNode = document.getElementById('edit-content').cloneNode(true);
	copyNode.removeAttribute('id');
	copyNode.removeAttribute('contenteditable');
	return {
		timestamp: Date.now(),
		from: User.ID,
		to: Room.ID,
		content: copyNode.outerHTML
	};
}
function createMessageOut(msgOut) {
	return `<div class="message clearfix"><div class="chat-message pull-right message-out"><div class="message-author"></div><div class="message-text">${msgOut.content}</div><div class="message-meta">${formateTime(msgOut.timestamp)}</div></div></div>`;
}

function formatDate(dateObj) {
	var year = dateObj.getFullYear();
	var month = dateObj.getMonth() + 1;
	var date = dateObj.getDate();
	return `${year}/${month}/${date}`;
}
function formateTime(timestamp) {
	var obj = new Date(timestamp);
	return `${obj.getHours()}:${obj.getMinutes()}`;
}

function randomRGB() {
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	return `rgb(${r},${g},${b})`;
}

var fontList = [
	{ name: 'Default', value: 'inherit' },
	{ name: 'Georgia', value: 'Georgia,serif' },
	{ name: 'Palatino Linotype', value: '"Palatino Linotype","Book Antiqua",Palatino,serif' },
	{ name: 'Times New Roman', value: '"Times New Roman",Times,serif' },
	{ name: 'Arial', value: 'Arial,Helvetica,sans-serif' },
	{ name: 'Arial Black', value: '"Arial Black",Gadget,sans-serif' },
	{ name: 'Comic Sans MS', value: '"Comic Sans MS",cursive,sans-serif' },
	{ name: 'Impact', value: 'Impact,Charcoal,sans-serif' },
	{ name: 'Lucida Sans Unicode', value: '"Lucida Sans Unicode","Lucida Grande",sans-serif' },
	{ name: 'Tahoma', value: 'Tahoma,Geneva,sans-serif' },
	{ name: 'Trebuchet MS', value: '"Trebuchet MS",Helvetica,sans-serif' },
	{ name: 'Verdana', value: 'Verdana,Geneva,sans-serif' },
	{ name: 'Courier New', value: '"Courier New",Courier,monospace' },
	{ name: 'Lucida Console', value: '"Lucida Console",Monaco,monospace' }
];

var weightList = [
	{ name: 'Default', value: 'normal' },
	{ name: '100', value: '100' },
	{ name: '200', value: '200' },
	{ name: '300', value: '300' },
	{ name: '400', value: '400' },
	{ name: '500', value: '500' },
	{ name: '600', value: '600' },
	{ name: '700', value: '700' },
	{ name: '800', value: '800' },
	{ name: '900', value: '900' },
];

var sizeList = [
	{ name: 'Default', value: '1.3em' },
	{ name: 'h6', value: '0.67em' },
	{ name: 'h5', value: '0.83em' },
	{ name: 'h4', value: '1em' },
	{ name: 'h3', value: '1.17em' },
	{ name: 'h2', value: '1.5em' },
	{ name: 'h1', value: '2em' },
];