$(document).ready(function () {
	var itemList = [];
	for(var user in UserList) {
		itemList.push(createListItem(UserList[user]));
	}
	addItemToContactList(itemList);
	showRoomMembers();

	var evtList = [];
	for(var evtObj of EventList) {
		if(evtObj.type == "message") {
			if(evtObj.from == User.name)
				evtList.push(createMessageOut(evtObj));
			else
				evtList.push(createMessageIn(evtObj));
		}
	}
	addMessageToList(evtList);

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
		this.append($(`<li><a style="font-size:${currentValue.value}">${currentValue.name}</a></li>`));
	}, $('[aria-labelledby="size-button"]'));
	$('[aria-labelledby="size-button"] li a').click(function (evtObj) {
		$('#edit-content').css('font-size', $(evtObj.target).css('font-size'));
	});

	colorList.forEach(function(currentValue) {
		this.append(`<li><a style="color:${currentValue.value};">${currentValue.name}</a></li>`);
	}, $('[aria-labelledby="color-button"]'));
	$('[aria-labelledby="color-button"] li a').click(function (evtObj) {
		$('#edit-content').css('color', $(evtObj.target).css('color'));
	});

	colorList.forEach(function(currentValue) {
		this.append(`<li><a style="background-color:${currentValue.value};color:rgba(0,0,0,0);">${currentValue.name.substr(0,5)}</a></li>`);
	}, $('[aria-labelledby="background-button"]'));
	$('[aria-labelledby="background-button"] li a').click(function (evtObj) {
		$('#edit-content').css('background-color', $(evtObj.target).css('background-color'));
	});

	$('#edit-content').on('paste', function (evtObj) {
		setTimeout(function () {
			var str = $('#edit-content').html().replace(/(<span(.*?)>)/, ' ').replace('</span>', ' ');
			$('#edit-content').empty().html(str);
		}, 0);
	});

	$('#send').click(function () {
		var content = $('#edit-content').html();
		if (content.match(/^[<br>|<br/>|<br />]*$/)) {
			addMessageToList(createSystemNotification("content can't be blank"));
		} else {
			var msgOut = generateMessageOut();
			var msgOutPost = new FormData();
			msgOutPost.set("timestamp", msgOut.timestamp);
			msgOutPost.set("from", msgOut.from);
			msgOutPost.set("to", msgOut.to);
			msgOutPost.set("content", msgOut.content);
			$.ajax({
				url: "php/add_message.php",
				type: "POST",
				data: msgOutPost,
				async: true,
				cache: false,
				contentType: false,
				processData: false
			}).done(function(data) {
				
			}).fail(function(error) {
				console.log("fail");
			});
			$("#edit-content").empty();
		}
	});

	$("#sound").hide();
	$("#mute i").hide();
	$("#mute").click(function() {
		var mute = $("#sound").prop("muted");
		mute = !mute;
		$("#sound").prop("muted", mute);
		if(mute)
			$("#mute i").show();
		else
			$("#mute i").hide();
	});

	$("#logout").click(function() {
		var logoutObj = new FormData();
		logoutObj.set("username", User.name);
		logoutObj.set("timestamp", Date.now());
		$.ajax({
			url: "php/logout.php",
			type: "POST",
			data: logoutObj,
			async: true,
			cache: false,
			contentType: false,
			processData: false
		}).done(function(data) {
			console.log(data);
			window.location = "index.html";
		}).fail(function(error) {
			console.log("fail");
		}).always(function() {

		});
	});
	
	$(".chat-avatar").click(function() {
		if(NewWindow)
			NewWindow.close();
		NewWindow = window.open("userstate.php", "_blank", "width=400,height=600");
	});

	$(window).on("beforeunload", function(evt) {
		//console.log(evt);
		//evt.returnValue = "You'll log out if you leave this page";
		//return evt;
	});
	$(window).on("unload", pageClosed);

	keepUpdate();
});

function pageClosed(evt) {
	console.log(evt);
	var logoutObj = new FormData();
	logoutObj.set("username", User.name);
	logoutObj.set("timestamp", Date.now());
	$.ajax({
		url: "php/logout.php",
		type: "POST",
		data: logoutObj,
		async: false,
		cache: false,
		contentType: false,
		processData: false
	}).done(function(data) {
		alert(data);
		console.log(data);
		window.location = "index.html";
	}).fail(function(error) {
		console.log("fail");
	}).always(function() {

	});
	if(NewWindow) {
		NewWindow.close();
	}
}

function showRoomMembers() {
	var nameList = [];
	for(var name in UserList) {
		nameList.push(name);
	}
	var nameStr = nameList.join(", ");
	var maxLen = 30;
	nameStr = nameStr.length < maxLen ? nameStr : nameStr.substr(0, maxLen-3)+"...";
	$(".chat-members").empty().text(nameStr);
}

function addMessageToList(msg) {
	var messageList = $('.message-list');
	var scrollToBottom = false;
	if (messageList.height() + messageList.scrollTop() >= messageList.prop('scrollHeight') - 10)
		scrollToBottom = true;
	if (Array.isArray(msg)) {
		msg.forEach(function (currentValue) {
			this.append(currentValue);
		}, messageList);
	} else {
		messageList.append(msg);
	}
	if (scrollToBottom)
		messageList.animate({ scrollTop: messageList.prop("scrollHeight") }, 500);
}
function createSystemMessage(msgStr) {
	return `<div class="message"><div class="system-message-body"><span class="system-message">${msgStr}</span></div></div>`;
}
function createSystemNotification(msgStr) {
	return `<div class="message"><div class="system-message-body"><span class="system-notification">${msgStr}</span></div></div>`;
}
function generateMessageOut() {
	var copyNode = document.getElementById('edit-content').cloneNode(true);
	copyNode.removeAttribute('id');
	copyNode.removeAttribute('contenteditable');
	copyNode.innerHTML = copyNode.innerHTML.linkify();
	return {
		timestamp: Date.now(),
		from: User.name,
		to: "room",
		content: copyNode.outerHTML
	};
}
function createMessageOut(msgOut) {
	return `<div class="message clearfix"><div class="chat-message pull-right message-out"><div class="message-author"></div><div class="message-text">${msgOut.content}</div><div class="message-meta">${formateTime(msgOut.timestamp)}</div></div></div>`;
}
function createMessageIn(msgIn) {
	var name = null;
	if(UserList.hasOwnProperty(msgIn.from))
		name = UserList[msgIn.from].name;
	return `<div class="message clearfix"><div class="chat-message pull-left"><div class="message-in"><div class="message-author ${name?'':'anonymous'}">${name || 'anonymouse'}</div><div class="message-text">${msgIn.content}</div><div class="message-meta">${formateTime(msgIn.timestamp)}</div></div></div></div>`;
}

function parseMessageToXMLString(msg) {
	return $(`<message><timestamp>${msg.timestamp}</timestamp><from>${msg.from}</from><to>${msg.to}</to><content>${msg.content}</content></message>`)[0].outerHTML;
}
function parseMessageFromXMLString(msgStr) {
	var msgObj = $($.parseXML(msgStr));
	return {
		timestamp: msgObj.find('message timestamp').text(),
		from: msgObj.find('message from').text(),
		to: msgObj.find('message to').text(),
		content: msgObj.find('message content').html()
	};
}
function parseEventXMLtoJson(evtStr) {
	var evtObj = $($.parseXML(evtStr))
	return {
		type: evtObj.find("type").text(),
		timestamp: evtObj.find("timestamp").text(),
		from: evtObj.find("from").text(),
		to: evtObj.find("to").text(),
		content: htmlDecode(evtObj.find("content").html())
	};
}
function htmlDecode(input) {
	var e = document.createElement('div');
	e.innerHTML = input;
	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}


function addItemToContactList(item) {
	var contactList = $('#contact-list');
	if(Array.isArray(item)) {
		item.forEach(function(currentValue) {
			this.append(currentValue);
		}, contactList);
	}else {
		contactList.append(item);
	}
}
function createListItem(item) {
	return `<div class="contact-list-item ${(item.online=="true")?'':'off-line'}" id="${item.name}"><div class="avatar"><img src="${"data/images/"+item.imgSrc || 'img/default-user-image.svg'}" class="item-img img-circle center-block" /></div><div class="item-body"><div class="item-title"><p class="item-name">${item.name || 'anonymous'}</p><span class="item-time">${formatDate(item.timestamp || Date.now())}</span></div><div class="item-info">${item.info || ''}</div></div></div>`;
}
function updateContactListItem(msgIn) {
	var item = $(`#${msgIn.from}`);
	if(item.length == 0)
		return;
	var str = $(msgIn.content).text();
	str = str.length<20 ? str : str.substr(0, 17)+'...';
	item.find('.item-time').empty().text(formateTime(msgIn.timestamp));
	item.find('.item-info').empty().text(str);
	item.remove().prependTo($('#contact-list'));
}

function keepUpdate() {
	var queryObj = new FormData();
	queryObj.set("filesize", FileSize);
	queryObj.set("timestamp", EventList[EventList.length-1].timestamp);
	$.ajax({
		url: "php/server.php",
		type: "POST",
		data: queryObj,
		async: true,
		cache: false,
		contentType: false,
		processData: false
	}).done(function(data) {
		console.log(data);
		if(data.length > 0) {
			var sound = document.getElementById("sound");
			if(sound) {
				sound.currentTime = 0;
				sound.play();
			}
		}

		var newEvents = $($.parseXML(data));
		FileSize = newEvents.find("filesize").text() || FileSize;

		var newEventArr = [];
		newEvents.find("newEvents").children().each(function(index, value) {
			var newEvt = $(value);
			newEventArr.push({
				type: newEvt.find("type").text(),
				timestamp: newEvt.find("timestamp").text(),
				from: newEvt.find("from").text(),
				to: newEvt.find("to").text(),
				content: htmlDecode(newEvt.find("content").html())
			})
		});
		newEventArr.sort(function(a, b) {
			return parseInt(a.timestamp) - parseInt(b.timestamp);
		});
		newEventArr.forEach(function(currentValue) {
			if(currentValue.type == "message") {
				console.log("message");
				if(currentValue.from == User.name)
					addMessageToList(createMessageOut(currentValue));
				else
					addMessageToList(createMessageIn(currentValue));
			}else if(currentValue.type == "login") {
				console.log("log in");
				$(`#${currentValue.from}`).removeClass("off-line");
				addMessageToList(createSystemMessage(`${currentValue.from} logs in`));
			}else if(currentValue.type == "logout") {
				console.log("log out");
				$(`#${currentValue.from}`).addClass("off-line");
				addMessageToList(createSystemMessage(`${currentValue.from} logs out`));
			}else if(currentValue.type == "register") {
				console.log("register");
				UserList[currentValue.from] = {
					name: currentValue.from,
					online: "false",
					imgSrc: currentValue.content
				};
				addItemToContactList(createListItem({
					name: currentValue.from,
					online: "false",
					imgSrc: currentValue.content,
					timestamp: currentValue.timestamp
				}));
				addMessageToList(createSystemMessage(`${currentValue.from} enter this room`));
				showRoomMembers();
			}
		});
		EventList =  EventList.concat(newEventArr);
		keepUpdate();
	}).fail(function(error) {
		console.log("fail");
	});
}

function formatDate(timestamp) {
	var dateObj = new Date(timestamp);
	var year = dateObj.getFullYear();
	var month = dateObj.getMonth() + 1;
	var date = dateObj.getDate();
	return `${year}/${month}/${date}`;
}
function formateTime(timestamp) {
	var obj = new Date(parseInt(timestamp));
	return `${obj.getHours()}:${('0' + obj.getMinutes()).substr(-2)}`;
}

function randomRGB() {
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	return `rgb(${r},${g},${b})`;
}

if(!String.linkify) {
    String.prototype.linkify = function() {

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

        return this
            .replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
    };
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

var colorList = [
	{ "name": "Default", "value": "rgb(0, 0, 0)" },
	{ "name": "Air Force blue", "value": "rgb(93, 138, 168)" },
	{ "name": "Alice blue", "value": "rgb(240, 248, 255)" },
	{ "name": "Alizarin crimson", "value": "rgb(227, 38, 54)" },
	{ "name": "Almond", "value": "rgb(239, 222, 205)" },
	{ "name": "Amaranth", "value": "rgb(229, 43, 80)" },
	{ "name": "Amber", "value": "rgb(255, 191, 0)" },
	{ "name": "American rose", "value": "rgb(255, 3, 62)" },
	{ "name": "Amethyst", "value": "rgb(153, 102, 204)" },
	{ "name": "Android Green", "value": "rgb(164, 198, 57)" },
	{ "name": "Anti-flash white", "value": "rgb(242, 243, 244)" },
	{ "name": "Antique brass", "value": "rgb(205, 149, 117)" },
	{ "name": "Antique fuchsia", "value": "rgb(145, 92, 131)" },
	{ "name": "Antique white", "value": "rgb(250, 235, 215)" },
	{ "name": "Ao", "value": "rgb(0, 128, 0)" },
	{ "name": "Apple green", "value": "rgb(141, 182, 0)" },
	{ "name": "Apricot", "value": "rgb(251, 206, 177)" },
	{ "name": "Aqua", "value": "rgb(0, 255, 255)" },
	{ "name": "Aquamarine", "value": "rgb(127, 255, 212)" },
	{ "name": "Army green", "value": "rgb(75, 83, 32)" },
	{ "name": "Arylide yellow", "value": "rgb(233, 214, 107)" },
	{ "name": "Ash grey", "value": "rgb(178, 190, 181)" },
	{ "name": "Asparagus", "value": "rgb(135, 169, 107)" },
	{ "name": "Atomic tangerine", "value": "rgb(255, 153, 102)" },
	{ "name": "Auburn", "value": "rgb(165, 42, 42)" },
	{ "name": "Aureolin", "value": "rgb(253, 238, 0)" },
	{ "name": "AuroMetalSaurus", "value": "rgb(110, 127, 128)" },
	{ "name": "Awesome", "value": "rgb(255, 32, 82)" },
	{ "name": "Azure", "value": "rgb(0, 127, 255)" },
	{ "name": "Azure mist/web", "value": "rgb(240, 255, 255)" },
	{ "name": "Baby blue", "value": "rgb(137, 207, 240)" },
	{ "name": "Baby blue eyes", "value": "rgb(161, 202, 241)" },
	{ "name": "Baby pink", "value": "rgb(244, 194, 194)" },
	{ "name": "Ball Blue", "value": "rgb(33, 171, 205)" },
	{ "name": "Banana Mania", "value": "rgb(250, 231, 181)" },
	{ "name": "Banana yellow", "value": "rgb(255, 225, 53)" },
	{ "name": "Battleship grey", "value": "rgb(132, 132, 130)" },
	{ "name": "Bazaar", "value": "rgb(152, 119, 123)" },
	{ "name": "Beau blue", "value": "rgb(188, 212, 230)" },
	{ "name": "Beaver", "value": "rgb(159, 129, 112)" },
	{ "name": "Beige", "value": "rgb(245, 245, 220)" },
	{ "name": "Bisque", "value": "rgb(255, 228, 196)" },
	{ "name": "Bistre", "value": "rgb(61, 43, 31)" },
	{ "name": "Bittersweet", "value": "rgb(254, 111, 94)" },
	{ "name": "Blanched Almond", "value": "rgb(255, 235, 205)" },
	{ "name": "Bleu de France", "value": "rgb(49, 140, 231)" },
	{ "name": "Blizzard Blue", "value": "rgb(172, 229, 238)" },
	{ "name": "Blond", "value": "rgb(250, 240, 190)" },
	{ "name": "Blue", "value": "rgb(0, 0, 255)" },
	{ "name": "Blue Bell", "value": "rgb(162, 162, 208)" },
	{ "name": "Blue Gray", "value": "rgb(102, 153, 204)" },
	{ "name": "Blue green", "value": "rgb(13, 152, 186)" },
	{ "name": "Blue purple", "value": "rgb(138, 43, 226)" },
	{ "name": "Blue violet", "value": "rgb(138, 43, 226)" },
	{ "name": "Blush", "value": "rgb(222, 93, 131)" },
	{ "name": "Bole", "value": "rgb(121, 68, 59)" },
	{ "name": "Bondi blue", "value": "rgb(0, 149, 182)" },
	{ "name": "Bone", "value": "rgb(227, 218, 201)" },
	{ "name": "Boston University Red", "value": "rgb(204, 0, 0)" },
	{ "name": "Bottle green", "value": "rgb(0, 106, 78)" },
	{ "name": "Boysenberry", "value": "rgb(135, 50, 96)" },
	{ "name": "Brandeis blue", "value": "rgb(0, 112, 255)" },
	{ "name": "Brass", "value": "rgb(181, 166, 66)" },
	{ "name": "Brick red", "value": "rgb(203, 65, 84)" },
	{ "name": "Bright cerulean", "value": "rgb(29, 172, 214)" },
	{ "name": "Bright green", "value": "rgb(102, 255, 0)" },
	{ "name": "Bright lavender", "value": "rgb(191, 148, 228)" },
	{ "name": "Bright maroon", "value": "rgb(195, 33, 72)" },
	{ "name": "Bright pink", "value": "rgb(255, 0, 127)" },
	{ "name": "Bright turquoise", "value": "rgb(8, 232, 222)" },
	{ "name": "Bright ube", "value": "rgb(209, 159, 232)" },
	{ "name": "Brilliant lavender", "value": "rgb(244, 187, 255)" },
	{ "name": "Brilliant rose", "value": "rgb(255, 85, 163)" },
	{ "name": "Brink pink", "value": "rgb(251, 96, 127)" },
	{ "name": "British racing green", "value": "rgb(0, 66, 37)" },
	{ "name": "Bronze", "value": "rgb(205, 127, 50)" },
	{ "name": "Brown", "value": "rgb(165, 42, 42)" },
	{ "name": "Bubble gum", "value": "rgb(255, 193, 204)" },
	{ "name": "Bubbles", "value": "rgb(231, 254, 255)" },
	{ "name": "Buff", "value": "rgb(240, 220, 130)" },
	{ "name": "Bulgarian rose", "value": "rgb(72, 6, 7)" },
	{ "name": "Burgundy", "value": "rgb(128, 0, 32)" },
	{ "name": "Burlywood", "value": "rgb(222, 184, 135)" },
	{ "name": "Burnt orange", "value": "rgb(204, 85, 0)" },
	{ "name": "Burnt sienna", "value": "rgb(233, 116, 81)" },
	{ "name": "Burnt umber", "value": "rgb(138, 51, 36)" },
	{ "name": "Byzantine", "value": "rgb(189, 51, 164)" },
	{ "name": "Byzantium", "value": "rgb(112, 41, 99)" },
	{ "name": "CG Blue", "value": "rgb(0, 122, 165)" },
	{ "name": "CG Red", "value": "rgb(224, 60, 49)" },
	{ "name": "Cadet", "value": "rgb(83, 104, 114)" },
	{ "name": "Cadet blue", "value": "rgb(95, 158, 160)" },
	{ "name": "Cadet grey", "value": "rgb(145, 163, 176)" },
	{ "name": "Cadmium green", "value": "rgb(0, 107, 60)" },
	{ "name": "Cadmium orange", "value": "rgb(237, 135, 45)" },
	{ "name": "Cadmium red", "value": "rgb(227, 0, 34)" },
	{ "name": "Cadmium yellow", "value": "rgb(255, 246, 0)" },
	{ "name": "Café au lait", "value": "rgb(166, 123, 91)" },
	{ "name": "Café noir", "value": "rgb(75, 54, 33)" },
	{ "name": "Cal Poly Pomona green", "value": "rgb(30, 77, 43)" },
	{ "name": "Cambridge Blue", "value": "rgb(163, 193, 173)" },
	{ "name": "Camel", "value": "rgb(193, 154, 107)" },
	{ "name": "Camouflage green", "value": "rgb(120, 134, 107)" },
	{ "name": "Canary", "value": "rgb(255, 255, 153)" },
	{ "name": "Canary yellow", "value": "rgb(255, 239, 0)" },
	{ "name": "Candy apple red", "value": "rgb(255, 8, 0)" },
	{ "name": "Candy pink", "value": "rgb(228, 113, 122)" },
	{ "name": "Capri", "value": "rgb(0, 191, 255)" },
	{ "name": "Caput mortuum", "value": "rgb(89, 39, 32)" },
	{ "name": "Cardinal", "value": "rgb(196, 30, 58)" },
	{ "name": "Caribbean green", "value": "rgb(0, 204, 153)" },
	{ "name": "Carmine", "value": "rgb(255, 0, 64)" },
	{ "name": "Carmine pink", "value": "rgb(235, 76, 66)" },
	{ "name": "Carmine red", "value": "rgb(255, 0, 56)" },
	{ "name": "Carnation pink", "value": "rgb(255, 166, 201)" },
	{ "name": "Carnelian", "value": "rgb(179, 27, 27)" },
	{ "name": "Carolina blue", "value": "rgb(153, 186, 221)" },
	{ "name": "Carrot orange", "value": "rgb(237, 145, 33)" },
	{ "name": "Celadon", "value": "rgb(172, 225, 175)" },
	{ "name": "Celeste", "value": "rgb(178, 255, 255)" },
	{ "name": "Celestial blue", "value": "rgb(73, 151, 208)" },
	{ "name": "Cerise", "value": "rgb(222, 49, 99)" },
	{ "name": "Cerise pink", "value": "rgb(236, 59, 131)" },
	{ "name": "Cerulean", "value": "rgb(0, 123, 167)" },
	{ "name": "Cerulean blue", "value": "rgb(42, 82, 190)" },
	{ "name": "Chamoisee", "value": "rgb(160, 120, 90)" },
	{ "name": "Champagne", "value": "rgb(250, 214, 165)" },
	{ "name": "Charcoal", "value": "rgb(54, 69, 79)" },
	{ "name": "Chartreuse", "value": "rgb(127, 255, 0)" },
	{ "name": "Cherry", "value": "rgb(222, 49, 99)" },
	{ "name": "Cherry blossom pink", "value": "rgb(255, 183, 197)" },
	{ "name": "Chestnut", "value": "rgb(205, 92, 92)" },
	{ "name": "Chocolate", "value": "rgb(210, 105, 30)" },
	{ "name": "Chrome yellow", "value": "rgb(255, 167, 0)" },
	{ "name": "Cinereous", "value": "rgb(152, 129, 123)" },
	{ "name": "Cinnabar", "value": "rgb(227, 66, 52)" },
	{ "name": "Cinnamon", "value": "rgb(210, 105, 30)" },
	{ "name": "Citrine", "value": "rgb(228, 208, 10)" },
	{ "name": "Classic rose", "value": "rgb(251, 204, 231)" },
	{ "name": "Cobalt", "value": "rgb(0, 71, 171)" },
	{ "name": "Cocoa brown", "value": "rgb(210, 105, 30)" },
	{ "name": "Coffee", "value": "rgb(111, 78, 55)" },
	{ "name": "Columbia blue", "value": "rgb(155, 221, 255)" },
	{ "name": "Cool black", "value": "rgb(0, 46, 99)" },
	{ "name": "Cool grey", "value": "rgb(140, 146, 172)" },
	{ "name": "Copper", "value": "rgb(184, 115, 51)" },
	{ "name": "Copper rose", "value": "rgb(153, 102, 102)" },
	{ "name": "Coquelicot", "value": "rgb(255, 56, 0)" },
	{ "name": "Coral", "value": "rgb(255, 127, 80)" },
	{ "name": "Coral pink", "value": "rgb(248, 131, 121)" },
	{ "name": "Coral red", "value": "rgb(255, 64, 64)" },
	{ "name": "Cordovan", "value": "rgb(137, 63, 69)" },
	{ "name": "Corn", "value": "rgb(251, 236, 93)" },
	{ "name": "Cornell Red", "value": "rgb(179, 27, 27)" },
	{ "name": "Cornflower", "value": "rgb(154, 206, 235)" },
	{ "name": "Cornflower blue", "value": "rgb(100, 149, 237)" },
	{ "name": "Cornsilk", "value": "rgb(255, 248, 220)" },
	{ "name": "Cosmic latte", "value": "rgb(255, 248, 231)" },
	{ "name": "Cotton candy", "value": "rgb(255, 188, 217)" },
	{ "name": "Cream", "value": "rgb(255, 253, 208)" },
	{ "name": "Crimson", "value": "rgb(220, 20, 60)" },
	{ "name": "Crimson Red", "value": "rgb(153, 0, 0)" },
	{ "name": "Crimson glory", "value": "rgb(190, 0, 50)" },
	{ "name": "Cyan", "value": "rgb(0, 255, 255)" },
	{ "name": "Daffodil", "value": "rgb(255, 255, 49)" },
	{ "name": "Dandelion", "value": "rgb(240, 225, 48)" },
	{ "name": "Dark blue", "value": "rgb(0, 0, 139)" },
	{ "name": "Dark brown", "value": "rgb(101, 67, 33)" },
	{ "name": "Dark byzantium", "value": "rgb(93, 57, 84)" },
	{ "name": "Dark candy apple red", "value": "rgb(164, 0, 0)" },
	{ "name": "Dark cerulean", "value": "rgb(8, 69, 126)" },
	{ "name": "Dark chestnut", "value": "rgb(152, 105, 96)" },
	{ "name": "Dark coral", "value": "rgb(205, 91, 69)" },
	{ "name": "Dark cyan", "value": "rgb(0, 139, 139)" },
	{ "name": "Dark electric blue", "value": "rgb(83, 104, 120)" },
	{ "name": "Dark goldenrod", "value": "rgb(184, 134, 11)" },
	{ "name": "Dark gray", "value": "rgb(169, 169, 169)" },
	{ "name": "Dark green", "value": "rgb(1, 50, 32)" },
	{ "name": "Dark jungle green", "value": "rgb(26, 36, 33)" },
	{ "name": "Dark khaki", "value": "rgb(189, 183, 107)" },
	{ "name": "Dark lava", "value": "rgb(72, 60, 50)" },
	{ "name": "Dark lavender", "value": "rgb(115, 79, 150)" },
	{ "name": "Dark magenta", "value": "rgb(139, 0, 139)" },
	{ "name": "Dark midnight blue", "value": "rgb(0, 51, 102)" },
	{ "name": "Dark olive green", "value": "rgb(85, 107, 47)" },
	{ "name": "Dark orange", "value": "rgb(255, 140, 0)" },
	{ "name": "Dark orchid", "value": "rgb(153, 50, 204)" },
	{ "name": "Dark pastel blue", "value": "rgb(119, 158, 203)" },
	{ "name": "Dark pastel green", "value": "rgb(3, 192, 60)" },
	{ "name": "Dark pastel purple", "value": "rgb(150, 111, 214)" },
	{ "name": "Dark pastel red", "value": "rgb(194, 59, 34)" },
	{ "name": "Dark pink", "value": "rgb(231, 84, 128)" },
	{ "name": "Dark powder blue", "value": "rgb(0, 51, 153)" },
	{ "name": "Dark raspberry", "value": "rgb(135, 38, 87)" },
	{ "name": "Dark red", "value": "rgb(139, 0, 0)" },
	{ "name": "Dark salmon", "value": "rgb(233, 150, 122)" },
	{ "name": "Dark scarlet", "value": "rgb(86, 3, 25)" },
	{ "name": "Dark sea green", "value": "rgb(143, 188, 143)" },
	{ "name": "Dark sienna", "value": "rgb(60, 20, 20)" },
	{ "name": "Dark slate blue", "value": "rgb(72, 61, 139)" },
	{ "name": "Dark slate gray", "value": "rgb(47, 79, 79)" },
	{ "name": "Dark spring green", "value": "rgb(23, 114, 69)" },
	{ "name": "Dark tan", "value": "rgb(145, 129, 81)" },
	{ "name": "Dark tangerine", "value": "rgb(255, 168, 18)" },
	{ "name": "Dark taupe", "value": "rgb(72, 60, 50)" },
	{ "name": "Dark terra cotta", "value": "rgb(204, 78, 92)" },
	{ "name": "Dark turquoise", "value": "rgb(0, 206, 209)" },
	{ "name": "Dark violet", "value": "rgb(148, 0, 211)" },
	{ "name": "Dartmouth green", "value": "rgb(0, 105, 62)" },
	{ "name": "Davy grey", "value": "rgb(85, 85, 85)" },
	{ "name": "Debian red", "value": "rgb(215, 10, 83)" },
	{ "name": "Deep carmine", "value": "rgb(169, 32, 62)" },
	{ "name": "Deep carmine pink", "value": "rgb(239, 48, 56)" },
	{ "name": "Deep carrot orange", "value": "rgb(233, 105, 44)" },
	{ "name": "Deep cerise", "value": "rgb(218, 50, 135)" },
	{ "name": "Deep champagne", "value": "rgb(250, 214, 165)" },
	{ "name": "Deep chestnut", "value": "rgb(185, 78, 72)" },
	{ "name": "Deep coffee", "value": "rgb(112, 66, 65)" },
	{ "name": "Deep fuchsia", "value": "rgb(193, 84, 193)" },
	{ "name": "Deep jungle green", "value": "rgb(0, 75, 73)" },
	{ "name": "Deep lilac", "value": "rgb(153, 85, 187)" },
	{ "name": "Deep magenta", "value": "rgb(204, 0, 204)" },
	{ "name": "Deep peach", "value": "rgb(255, 203, 164)" },
	{ "name": "Deep pink", "value": "rgb(255, 20, 147)" },
	{ "name": "Deep saffron", "value": "rgb(255, 153, 51)" },
	{ "name": "Deep sky blue", "value": "rgb(0, 191, 255)" },
	{ "name": "Denim", "value": "rgb(21, 96, 189)" },
	{ "name": "Desert", "value": "rgb(193, 154, 107)" },
	{ "name": "Desert sand", "value": "rgb(237, 201, 175)" },
	{ "name": "Dim gray", "value": "rgb(105, 105, 105)" },
	{ "name": "Dodger blue", "value": "rgb(30, 144, 255)" },
	{ "name": "Dogwood rose", "value": "rgb(215, 24, 104)" },
	{ "name": "Dollar bill", "value": "rgb(133, 187, 101)" },
	{ "name": "Drab", "value": "rgb(150, 113, 23)" },
	{ "name": "Duke blue", "value": "rgb(0, 0, 156)" },
	{ "name": "Earth yellow", "value": "rgb(225, 169, 95)" },
	{ "name": "Ecru", "value": "rgb(194, 178, 128)" },
	{ "name": "Eggplant", "value": "rgb(97, 64, 81)" },
	{ "name": "Eggshell", "value": "rgb(240, 234, 214)" },
	{ "name": "Egyptian blue", "value": "rgb(16, 52, 166)" },
	{ "name": "Electric blue", "value": "rgb(125, 249, 255)" },
	{ "name": "Electric crimson", "value": "rgb(255, 0, 63)" },
	{ "name": "Electric cyan", "value": "rgb(0, 255, 255)" },
	{ "name": "Electric green", "value": "rgb(0, 255, 0)" },
	{ "name": "Electric indigo", "value": "rgb(111, 0, 255)" },
	{ "name": "Electric lavender", "value": "rgb(244, 187, 255)" },
	{ "name": "Electric lime", "value": "rgb(204, 255, 0)" },
	{ "name": "Electric purple", "value": "rgb(191, 0, 255)" },
	{ "name": "Electric ultramarine", "value": "rgb(63, 0, 255)" },
	{ "name": "Electric violet", "value": "rgb(143, 0, 255)" },
	{ "name": "Electric yellow", "value": "rgb(255, 255, 0)" },
	{ "name": "Emerald", "value": "rgb(80, 200, 120)" },
	{ "name": "Eton blue", "value": "rgb(150, 200, 162)" },
	{ "name": "Fallow", "value": "rgb(193, 154, 107)" },
	{ "name": "Falu red", "value": "rgb(128, 24, 24)" },
	{ "name": "Famous", "value": "rgb(255, 0, 255)" },
	{ "name": "Fandango", "value": "rgb(181, 51, 137)" },
	{ "name": "Fashion fuchsia", "value": "rgb(244, 0, 161)" },
	{ "name": "Fawn", "value": "rgb(229, 170, 112)" },
	{ "name": "Feldgrau", "value": "rgb(77, 93, 83)" },
	{ "name": "Fern", "value": "rgb(113, 188, 120)" },
	{ "name": "Fern green", "value": "rgb(79, 121, 66)" },
	{ "name": "Ferrari Red", "value": "rgb(255, 40, 0)" },
	{ "name": "Field drab", "value": "rgb(108, 84, 30)" },
	{ "name": "Fire engine red", "value": "rgb(206, 32, 41)" },
	{ "name": "Firebrick", "value": "rgb(178, 34, 34)" },
	{ "name": "Flame", "value": "rgb(226, 88, 34)" },
	{ "name": "Flamingo pink", "value": "rgb(252, 142, 172)" },
	{ "name": "Flavescent", "value": "rgb(247, 233, 142)" },
	{ "name": "Flax", "value": "rgb(238, 220, 130)" },
	{ "name": "Floral white", "value": "rgb(255, 250, 240)" },
	{ "name": "Fluorescent orange", "value": "rgb(255, 191, 0)" },
	{ "name": "Fluorescent pink", "value": "rgb(255, 20, 147)" },
	{ "name": "Fluorescent yellow", "value": "rgb(204, 255, 0)" },
	{ "name": "Folly", "value": "rgb(255, 0, 79)" },
	{ "name": "Forest green", "value": "rgb(34, 139, 34)" },
	{ "name": "French beige", "value": "rgb(166, 123, 91)" },
	{ "name": "French blue", "value": "rgb(0, 114, 187)" },
	{ "name": "French lilac", "value": "rgb(134, 96, 142)" },
	{ "name": "French rose", "value": "rgb(246, 74, 138)" },
	{ "name": "Fuchsia", "value": "rgb(255, 0, 255)" },
	{ "name": "Fuchsia pink", "value": "rgb(255, 119, 255)" },
	{ "name": "Fulvous", "value": "rgb(228, 132, 0)" },
	{ "name": "Fuzzy Wuzzy", "value": "rgb(204, 102, 102)" },
	{ "name": "Gainsboro", "value": "rgb(220, 220, 220)" },
	{ "name": "Gamboge", "value": "rgb(228, 155, 15)" },
	{ "name": "Ghost white", "value": "rgb(248, 248, 255)" },
	{ "name": "Ginger", "value": "rgb(176, 101, 0)" },
	{ "name": "Glaucous", "value": "rgb(96, 130, 182)" },
	{ "name": "Glitter", "value": "rgb(230, 232, 250)" },
	{ "name": "Gold", "value": "rgb(255, 215, 0)" },
	{ "name": "Golden brown", "value": "rgb(153, 101, 21)" },
	{ "name": "Golden poppy", "value": "rgb(252, 194, 0)" },
	{ "name": "Golden yellow", "value": "rgb(255, 223, 0)" },
	{ "name": "Goldenrod", "value": "rgb(218, 165, 32)" },
	{ "name": "Granny Smith Apple", "value": "rgb(168, 228, 160)" },
	{ "name": "Gray", "value": "rgb(128, 128, 128)" },
	{ "name": "Gray asparagus", "value": "rgb(70, 89, 69)" },
	{ "name": "Green", "value": "rgb(0, 255, 0)" },
	{ "name": "Green Blue", "value": "rgb(17, 100, 180)" },
	{ "name": "Green yellow", "value": "rgb(173, 255, 47)" },
	{ "name": "Grullo", "value": "rgb(169, 154, 134)" },
	{ "name": "Guppie green", "value": "rgb(0, 255, 127)" },
	{ "name": "Halayà úbe", "value": "rgb(102, 56, 84)" },
	{ "name": "Han blue", "value": "rgb(68, 108, 207)" },
	{ "name": "Han purple", "value": "rgb(82, 24, 250)" },
	{ "name": "Hansa yellow", "value": "rgb(233, 214, 107)" },
	{ "name": "Harlequin", "value": "rgb(63, 255, 0)" },
	{ "name": "Harvard crimson", "value": "rgb(201, 0, 22)" },
	{ "name": "Harvest Gold", "value": "rgb(218, 145, 0)" },
	{ "name": "Heart Gold", "value": "rgb(128, 128, 0)" },
	{ "name": "Heliotrope", "value": "rgb(223, 115, 255)" },
	{ "name": "Hollywood cerise", "value": "rgb(244, 0, 161)" },
	{ "name": "Honeydew", "value": "rgb(240, 255, 240)" },
	{ "name": "Hooker green", "value": "rgb(73, 121, 107)" },
	{ "name": "Hot magenta", "value": "rgb(255, 29, 206)" },
	{ "name": "Hot pink", "value": "rgb(255, 105, 180)" },
	{ "name": "Hunter green", "value": "rgb(53, 94, 59)" },
	{ "name": "Icterine", "value": "rgb(252, 247, 94)" },
	{ "name": "Inchworm", "value": "rgb(178, 236, 93)" },
	{ "name": "India green", "value": "rgb(19, 136, 8)" },
	{ "name": "Indian red", "value": "rgb(205, 92, 92)" },
	{ "name": "Indian yellow", "value": "rgb(227, 168, 87)" },
	{ "name": "Indigo", "value": "rgb(75, 0, 130)" },
	{ "name": "International Klein Blue", "value": "rgb(0, 47, 167)" },
	{ "name": "International orange", "value": "rgb(255, 79, 0)" },
	{ "name": "Iris", "value": "rgb(90, 79, 207)" },
	{ "name": "Isabelline", "value": "rgb(244, 240, 236)" },
	{ "name": "Islamic green", "value": "rgb(0, 144, 0)" },
	{ "name": "Ivory", "value": "rgb(255, 255, 240)" },
	{ "name": "Jade", "value": "rgb(0, 168, 107)" },
	{ "name": "Jasmine", "value": "rgb(248, 222, 126)" },
	{ "name": "Jasper", "value": "rgb(215, 59, 62)" },
	{ "name": "Jazzberry jam", "value": "rgb(165, 11, 94)" },
	{ "name": "Jonquil", "value": "rgb(250, 218, 94)" },
	{ "name": "June bud", "value": "rgb(189, 218, 87)" },
	{ "name": "Jungle green", "value": "rgb(41, 171, 135)" },
	{ "name": "KU Crimson", "value": "rgb(232, 0, 13)" },
	{ "name": "Kelly green", "value": "rgb(76, 187, 23)" },
	{ "name": "Khaki", "value": "rgb(195, 176, 145)" },
	{ "name": "La Salle Green", "value": "rgb(8, 120, 48)" },
	{ "name": "Languid lavender", "value": "rgb(214, 202, 221)" },
	{ "name": "Lapis lazuli", "value": "rgb(38, 97, 156)" },
	{ "name": "Laser Lemon", "value": "rgb(254, 254, 34)" },
	{ "name": "Laurel green", "value": "rgb(169, 186, 157)" },
	{ "name": "Lava", "value": "rgb(207, 16, 32)" },
	{ "name": "Lavender", "value": "rgb(230, 230, 250)" },
	{ "name": "Lavender blue", "value": "rgb(204, 204, 255)" },
	{ "name": "Lavender blush", "value": "rgb(255, 240, 245)" },
	{ "name": "Lavender gray", "value": "rgb(196, 195, 208)" },
	{ "name": "Lavender indigo", "value": "rgb(148, 87, 235)" },
	{ "name": "Lavender magenta", "value": "rgb(238, 130, 238)" },
	{ "name": "Lavender mist", "value": "rgb(230, 230, 250)" },
	{ "name": "Lavender pink", "value": "rgb(251, 174, 210)" },
	{ "name": "Lavender purple", "value": "rgb(150, 123, 182)" },
	{ "name": "Lavender rose", "value": "rgb(251, 160, 227)" },
	{ "name": "Lawn green", "value": "rgb(124, 252, 0)" },
	{ "name": "Lemon", "value": "rgb(255, 247, 0)" },
	{ "name": "Lemon Yellow", "value": "rgb(255, 244, 79)" },
	{ "name": "Lemon chiffon", "value": "rgb(255, 250, 205)" },
	{ "name": "Lemon lime", "value": "rgb(191, 255, 0)" },
	{ "name": "Light Crimson", "value": "rgb(245, 105, 145)" },
	{ "name": "Light Thulian pink", "value": "rgb(230, 143, 172)" },
	{ "name": "Light apricot", "value": "rgb(253, 213, 177)" },
	{ "name": "Light blue", "value": "rgb(173, 216, 230)" },
	{ "name": "Light brown", "value": "rgb(181, 101, 29)" },
	{ "name": "Light carmine pink", "value": "rgb(230, 103, 113)" },
	{ "name": "Light coral", "value": "rgb(240, 128, 128)" },
	{ "name": "Light cornflower blue", "value": "rgb(147, 204, 234)" },
	{ "name": "Light cyan", "value": "rgb(224, 255, 255)" },
	{ "name": "Light fuchsia pink", "value": "rgb(249, 132, 239)" },
	{ "name": "Light goldenrod yellow", "value": "rgb(250, 250, 210)" },
	{ "name": "Light gray", "value": "rgb(211, 211, 211)" },
	{ "name": "Light green", "value": "rgb(144, 238, 144)" },
	{ "name": "Light khaki", "value": "rgb(240, 230, 140)" },
	{ "name": "Light pastel purple", "value": "rgb(177, 156, 217)" },
	{ "name": "Light pink", "value": "rgb(255, 182, 193)" },
	{ "name": "Light salmon", "value": "rgb(255, 160, 122)" },
	{ "name": "Light salmon pink", "value": "rgb(255, 153, 153)" },
	{ "name": "Light sea green", "value": "rgb(32, 178, 170)" },
	{ "name": "Light sky blue", "value": "rgb(135, 206, 250)" },
	{ "name": "Light slate gray", "value": "rgb(119, 136, 153)" },
	{ "name": "Light taupe", "value": "rgb(179, 139, 109)" },
	{ "name": "Light yellow", "value": "rgb(255, 255, 237)" },
	{ "name": "Lilac", "value": "rgb(200, 162, 200)" },
	{ "name": "Lime", "value": "rgb(191, 255, 0)" },
	{ "name": "Lime green", "value": "rgb(50, 205, 50)" },
	{ "name": "Lincoln green", "value": "rgb(25, 89, 5)" },
	{ "name": "Linen", "value": "rgb(250, 240, 230)" },
	{ "name": "Lion", "value": "rgb(193, 154, 107)" },
	{ "name": "Liver", "value": "rgb(83, 75, 79)" },
	{ "name": "Lust", "value": "rgb(230, 32, 32)" },
	{ "name": "MSU Green", "value": "rgb(24, 69, 59)" },
	{ "name": "Macaroni and Cheese", "value": "rgb(255, 189, 136)" },
	{ "name": "Magenta", "value": "rgb(255, 0, 255)" },
	{ "name": "Magic mint", "value": "rgb(170, 240, 209)" },
	{ "name": "Magnolia", "value": "rgb(248, 244, 255)" },
	{ "name": "Mahogany", "value": "rgb(192, 64, 0)" },
	{ "name": "Maize", "value": "rgb(251, 236, 93)" },
	{ "name": "Majorelle Blue", "value": "rgb(96, 80, 220)" },
	{ "name": "Malachite", "value": "rgb(11, 218, 81)" },
	{ "name": "Manatee", "value": "rgb(151, 154, 170)" },
	{ "name": "Mango Tango", "value": "rgb(255, 130, 67)" },
	{ "name": "Mantis", "value": "rgb(116, 195, 101)" },
	{ "name": "Maroon", "value": "rgb(128, 0, 0)" },
	{ "name": "Mauve", "value": "rgb(224, 176, 255)" },
	{ "name": "Mauve taupe", "value": "rgb(145, 95, 109)" },
	{ "name": "Mauvelous", "value": "rgb(239, 152, 170)" },
	{ "name": "Maya blue", "value": "rgb(115, 194, 251)" },
	{ "name": "Meat brown", "value": "rgb(229, 183, 59)" },
	{ "name": "Medium Persian blue", "value": "rgb(0, 103, 165)" },
	{ "name": "Medium aquamarine", "value": "rgb(102, 221, 170)" },
	{ "name": "Medium blue", "value": "rgb(0, 0, 205)" },
	{ "name": "Medium candy apple red", "value": "rgb(226, 6, 44)" },
	{ "name": "Medium carmine", "value": "rgb(175, 64, 53)" },
	{ "name": "Medium champagne", "value": "rgb(243, 229, 171)" },
	{ "name": "Medium electric blue", "value": "rgb(3, 80, 150)" },
	{ "name": "Medium jungle green", "value": "rgb(28, 53, 45)" },
	{ "name": "Medium lavender magenta", "value": "rgb(221, 160, 221)" },
	{ "name": "Medium orchid", "value": "rgb(186, 85, 211)" },
	{ "name": "Medium purple", "value": "rgb(147, 112, 219)" },
	{ "name": "Medium red violet", "value": "rgb(187, 51, 133)" },
	{ "name": "Medium sea green", "value": "rgb(60, 179, 113)" },
	{ "name": "Medium slate blue", "value": "rgb(123, 104, 238)" },
	{ "name": "Medium spring bud", "value": "rgb(201, 220, 135)" },
	{ "name": "Medium spring green", "value": "rgb(0, 250, 154)" },
	{ "name": "Medium taupe", "value": "rgb(103, 76, 71)" },
	{ "name": "Medium teal blue", "value": "rgb(0, 84, 180)" },
	{ "name": "Medium turquoise", "value": "rgb(72, 209, 204)" },
	{ "name": "Medium violet red", "value": "rgb(199, 21, 133)" },
	{ "name": "Melon", "value": "rgb(253, 188, 180)" },
	{ "name": "Midnight blue", "value": "rgb(25, 25, 112)" },
	{ "name": "Midnight green", "value": "rgb(0, 73, 83)" },
	{ "name": "Mikado yellow", "value": "rgb(255, 196, 12)" },
	{ "name": "Mint", "value": "rgb(62, 180, 137)" },
	{ "name": "Mint cream", "value": "rgb(245, 255, 250)" },
	{ "name": "Mint green", "value": "rgb(152, 255, 152)" },
	{ "name": "Misty rose", "value": "rgb(255, 228, 225)" },
	{ "name": "Moccasin", "value": "rgb(250, 235, 215)" },
	{ "name": "Mode beige", "value": "rgb(150, 113, 23)" },
	{ "name": "Moonstone blue", "value": "rgb(115, 169, 194)" },
	{ "name": "Mordant red 19", "value": "rgb(174, 12, 0)" },
	{ "name": "Moss green", "value": "rgb(173, 223, 173)" },
	{ "name": "Mountain Meadow", "value": "rgb(48, 186, 143)" },
	{ "name": "Mountbatten pink", "value": "rgb(153, 122, 141)" },
	{ "name": "Mulberry", "value": "rgb(197, 75, 140)" },
	{ "name": "Munsell", "value": "rgb(242, 243, 244)" },
	{ "name": "Mustard", "value": "rgb(255, 219, 88)" },
	{ "name": "Myrtle", "value": "rgb(33, 66, 30)" },
	{ "name": "Nadeshiko pink", "value": "rgb(246, 173, 198)" },
	{ "name": "Napier green", "value": "rgb(42, 128, 0)" },
	{ "name": "Naples yellow", "value": "rgb(250, 218, 94)" },
	{ "name": "Navajo white", "value": "rgb(255, 222, 173)" },
	{ "name": "Navy blue", "value": "rgb(0, 0, 128)" },
	{ "name": "Neon Carrot", "value": "rgb(255, 163, 67)" },
	{ "name": "Neon fuchsia", "value": "rgb(254, 89, 194)" },
	{ "name": "Neon green", "value": "rgb(57, 255, 20)" },
	{ "name": "Non-photo blue", "value": "rgb(164, 221, 237)" },
	{ "name": "North Texas Green", "value": "rgb(5, 144, 51)" },
	{ "name": "Ocean Boat Blue", "value": "rgb(0, 119, 190)" },
	{ "name": "Ochre", "value": "rgb(204, 119, 34)" },
	{ "name": "Office green", "value": "rgb(0, 128, 0)" },
	{ "name": "Old gold", "value": "rgb(207, 181, 59)" },
	{ "name": "Old lace", "value": "rgb(253, 245, 230)" },
	{ "name": "Old lavender", "value": "rgb(121, 104, 120)" },
	{ "name": "Old mauve", "value": "rgb(103, 49, 71)" },
	{ "name": "Old rose", "value": "rgb(192, 128, 129)" },
	{ "name": "Olive", "value": "rgb(128, 128, 0)" },
	{ "name": "Olive Drab", "value": "rgb(107, 142, 35)" },
	{ "name": "Olive Green", "value": "rgb(186, 184, 108)" },
	{ "name": "Olivine", "value": "rgb(154, 185, 115)" },
	{ "name": "Onyx", "value": "rgb(15, 15, 15)" },
	{ "name": "Opera mauve", "value": "rgb(183, 132, 167)" },
	{ "name": "Orange", "value": "rgb(255, 165, 0)" },
	{ "name": "Orange Yellow", "value": "rgb(248, 213, 104)" },
	{ "name": "Orange peel", "value": "rgb(255, 159, 0)" },
	{ "name": "Orange red", "value": "rgb(255, 69, 0)" },
	{ "name": "Orchid", "value": "rgb(218, 112, 214)" },
	{ "name": "Otter brown", "value": "rgb(101, 67, 33)" },
	{ "name": "Outer Space", "value": "rgb(65, 74, 76)" },
	{ "name": "Outrageous Orange", "value": "rgb(255, 110, 74)" },
	{ "name": "Oxford Blue", "value": "rgb(0, 33, 71)" },
	{ "name": "Pacific Blue", "value": "rgb(28, 169, 201)" },
	{ "name": "Pakistan green", "value": "rgb(0, 102, 0)" },
	{ "name": "Palatinate blue", "value": "rgb(39, 59, 226)" },
	{ "name": "Palatinate purple", "value": "rgb(104, 40, 96)" },
	{ "name": "Pale aqua", "value": "rgb(188, 212, 230)" },
	{ "name": "Pale blue", "value": "rgb(175, 238, 238)" },
	{ "name": "Pale brown", "value": "rgb(152, 118, 84)" },
	{ "name": "Pale carmine", "value": "rgb(175, 64, 53)" },
	{ "name": "Pale cerulean", "value": "rgb(155, 196, 226)" },
	{ "name": "Pale chestnut", "value": "rgb(221, 173, 175)" },
	{ "name": "Pale copper", "value": "rgb(218, 138, 103)" },
	{ "name": "Pale cornflower blue", "value": "rgb(171, 205, 239)" },
	{ "name": "Pale gold", "value": "rgb(230, 190, 138)" },
	{ "name": "Pale goldenrod", "value": "rgb(238, 232, 170)" },
	{ "name": "Pale green", "value": "rgb(152, 251, 152)" },
	{ "name": "Pale lavender", "value": "rgb(220, 208, 255)" },
	{ "name": "Pale magenta", "value": "rgb(249, 132, 229)" },
	{ "name": "Pale pink", "value": "rgb(250, 218, 221)" },
	{ "name": "Pale plum", "value": "rgb(221, 160, 221)" },
	{ "name": "Pale red violet", "value": "rgb(219, 112, 147)" },
	{ "name": "Pale robin egg blue", "value": "rgb(150, 222, 209)" },
	{ "name": "Pale silver", "value": "rgb(201, 192, 187)" },
	{ "name": "Pale spring bud", "value": "rgb(236, 235, 189)" },
	{ "name": "Pale taupe", "value": "rgb(188, 152, 126)" },
	{ "name": "Pale violet red", "value": "rgb(219, 112, 147)" },
	{ "name": "Pansy purple", "value": "rgb(120, 24, 74)" },
	{ "name": "Papaya whip", "value": "rgb(255, 239, 213)" },
	{ "name": "Paris Green", "value": "rgb(80, 200, 120)" },
	{ "name": "Pastel blue", "value": "rgb(174, 198, 207)" },
	{ "name": "Pastel brown", "value": "rgb(131, 105, 83)" },
	{ "name": "Pastel gray", "value": "rgb(207, 207, 196)" },
	{ "name": "Pastel green", "value": "rgb(119, 221, 119)" },
	{ "name": "Pastel magenta", "value": "rgb(244, 154, 194)" },
	{ "name": "Pastel orange", "value": "rgb(255, 179, 71)" },
	{ "name": "Pastel pink", "value": "rgb(255, 209, 220)" },
	{ "name": "Pastel purple", "value": "rgb(179, 158, 181)" },
	{ "name": "Pastel red", "value": "rgb(255, 105, 97)" },
	{ "name": "Pastel violet", "value": "rgb(203, 153, 201)" },
	{ "name": "Pastel yellow", "value": "rgb(253, 253, 150)" },
	{ "name": "Patriarch", "value": "rgb(128, 0, 128)" },
	{ "name": "Payne grey", "value": "rgb(83, 104, 120)" },
	{ "name": "Peach", "value": "rgb(255, 229, 180)" },
	{ "name": "Peach puff", "value": "rgb(255, 218, 185)" },
	{ "name": "Peach yellow", "value": "rgb(250, 223, 173)" },
	{ "name": "Pear", "value": "rgb(209, 226, 49)" },
	{ "name": "Pearl", "value": "rgb(234, 224, 200)" },
	{ "name": "Pearl Aqua", "value": "rgb(136, 216, 192)" },
	{ "name": "Peridot", "value": "rgb(230, 226, 0)" },
	{ "name": "Periwinkle", "value": "rgb(204, 204, 255)" },
	{ "name": "Persian blue", "value": "rgb(28, 57, 187)" },
	{ "name": "Persian indigo", "value": "rgb(50, 18, 122)" },
	{ "name": "Persian orange", "value": "rgb(217, 144, 88)" },
	{ "name": "Persian pink", "value": "rgb(247, 127, 190)" },
	{ "name": "Persian plum", "value": "rgb(112, 28, 28)" },
	{ "name": "Persian red", "value": "rgb(204, 51, 51)" },
	{ "name": "Persian rose", "value": "rgb(254, 40, 162)" },
	{ "name": "Phlox", "value": "rgb(223, 0, 255)" },
	{ "name": "Phthalo blue", "value": "rgb(0, 15, 137)" },
	{ "name": "Phthalo green", "value": "rgb(18, 53, 36)" },
	{ "name": "Piggy pink", "value": "rgb(253, 221, 230)" },
	{ "name": "Pine green", "value": "rgb(1, 121, 111)" },
	{ "name": "Pink", "value": "rgb(255, 192, 203)" },
	{ "name": "Pink Flamingo", "value": "rgb(252, 116, 253)" },
	{ "name": "Pink Sherbet", "value": "rgb(247, 143, 167)" },
	{ "name": "Pink pearl", "value": "rgb(231, 172, 207)" },
	{ "name": "Pistachio", "value": "rgb(147, 197, 114)" },
	{ "name": "Platinum", "value": "rgb(229, 228, 226)" },
	{ "name": "Plum", "value": "rgb(221, 160, 221)" },
	{ "name": "Portland Orange", "value": "rgb(255, 90, 54)" },
	{ "name": "Powder blue", "value": "rgb(176, 224, 230)" },
	{ "name": "Princeton orange", "value": "rgb(255, 143, 0)" },
	{ "name": "Prussian blue", "value": "rgb(0, 49, 83)" },
	{ "name": "Psychedelic purple", "value": "rgb(223, 0, 255)" },
	{ "name": "Puce", "value": "rgb(204, 136, 153)" },
	{ "name": "Pumpkin", "value": "rgb(255, 117, 24)" },
	{ "name": "Purple", "value": "rgb(128, 0, 128)" },
	{ "name": "Purple Heart", "value": "rgb(105, 53, 156)" },
	{ "name": "Purple Mountain's Majesty", "value": "rgb(157, 129, 186)" },
	{ "name": "Purple mountain majesty", "value": "rgb(150, 120, 182)" },
	{ "name": "Purple pizzazz", "value": "rgb(254, 78, 218)" },
	{ "name": "Purple taupe", "value": "rgb(80, 64, 77)" },
	{ "name": "Rackley", "value": "rgb(93, 138, 168)" },
	{ "name": "Radical Red", "value": "rgb(255, 53, 94)" },
	{ "name": "Raspberry", "value": "rgb(227, 11, 93)" },
	{ "name": "Raspberry glace", "value": "rgb(145, 95, 109)" },
	{ "name": "Raspberry pink", "value": "rgb(226, 80, 152)" },
	{ "name": "Raspberry rose", "value": "rgb(179, 68, 108)" },
	{ "name": "Raw Sienna", "value": "rgb(214, 138, 89)" },
	{ "name": "Razzle dazzle rose", "value": "rgb(255, 51, 204)" },
	{ "name": "Razzmatazz", "value": "rgb(227, 37, 107)" },
	{ "name": "Red", "value": "rgb(255, 0, 0)" },
	{ "name": "Red Orange", "value": "rgb(255, 83, 73)" },
	{ "name": "Red brown", "value": "rgb(165, 42, 42)" },
	{ "name": "Red violet", "value": "rgb(199, 21, 133)" },
	{ "name": "Rich black", "value": "rgb(0, 64, 64)" },
	{ "name": "Rich carmine", "value": "rgb(215, 0, 64)" },
	{ "name": "Rich electric blue", "value": "rgb(8, 146, 208)" },
	{ "name": "Rich lilac", "value": "rgb(182, 102, 210)" },
	{ "name": "Rich maroon", "value": "rgb(176, 48, 96)" },
	{ "name": "Rifle green", "value": "rgb(65, 72, 51)" },
	{ "name": "Robin's Egg Blue", "value": "rgb(31, 206, 203)" },
	{ "name": "Rose", "value": "rgb(255, 0, 127)" },
	{ "name": "Rose bonbon", "value": "rgb(249, 66, 158)" },
	{ "name": "Rose ebony", "value": "rgb(103, 72, 70)" },
	{ "name": "Rose gold", "value": "rgb(183, 110, 121)" },
	{ "name": "Rose madder", "value": "rgb(227, 38, 54)" },
	{ "name": "Rose pink", "value": "rgb(255, 102, 204)" },
	{ "name": "Rose quartz", "value": "rgb(170, 152, 169)" },
	{ "name": "Rose taupe", "value": "rgb(144, 93, 93)" },
	{ "name": "Rose vale", "value": "rgb(171, 78, 82)" },
	{ "name": "Rosewood", "value": "rgb(101, 0, 11)" },
	{ "name": "Rosso corsa", "value": "rgb(212, 0, 0)" },
	{ "name": "Rosy brown", "value": "rgb(188, 143, 143)" },
	{ "name": "Royal azure", "value": "rgb(0, 56, 168)" },
	{ "name": "Royal blue", "value": "rgb(65, 105, 225)" },
	{ "name": "Royal fuchsia", "value": "rgb(202, 44, 146)" },
	{ "name": "Royal purple", "value": "rgb(120, 81, 169)" },
	{ "name": "Ruby", "value": "rgb(224, 17, 95)" },
	{ "name": "Ruddy", "value": "rgb(255, 0, 40)" },
	{ "name": "Ruddy brown", "value": "rgb(187, 101, 40)" },
	{ "name": "Ruddy pink", "value": "rgb(225, 142, 150)" },
	{ "name": "Rufous", "value": "rgb(168, 28, 7)" },
	{ "name": "Russet", "value": "rgb(128, 70, 27)" },
	{ "name": "Rust", "value": "rgb(183, 65, 14)" },
	{ "name": "Sacramento State green", "value": "rgb(0, 86, 63)" },
	{ "name": "Saddle brown", "value": "rgb(139, 69, 19)" },
	{ "name": "Safety orange", "value": "rgb(255, 103, 0)" },
	{ "name": "Saffron", "value": "rgb(244, 196, 48)" },
	{ "name": "Saint Patrick Blue", "value": "rgb(35, 41, 122)" },
	{ "name": "Salmon", "value": "rgb(255, 140, 105)" },
	{ "name": "Salmon pink", "value": "rgb(255, 145, 164)" },
	{ "name": "Sand", "value": "rgb(194, 178, 128)" },
	{ "name": "Sand dune", "value": "rgb(150, 113, 23)" },
	{ "name": "Sandstorm", "value": "rgb(236, 213, 64)" },
	{ "name": "Sandy brown", "value": "rgb(244, 164, 96)" },
	{ "name": "Sandy taupe", "value": "rgb(150, 113, 23)" },
	{ "name": "Sap green", "value": "rgb(80, 125, 42)" },
	{ "name": "Sapphire", "value": "rgb(15, 82, 186)" },
	{ "name": "Satin sheen gold", "value": "rgb(203, 161, 53)" },
	{ "name": "Scarlet", "value": "rgb(255, 36, 0)" },
	{ "name": "School bus yellow", "value": "rgb(255, 216, 0)" },
	{ "name": "Screamin Green", "value": "rgb(118, 255, 122)" },
	{ "name": "Sea blue", "value": "rgb(0, 105, 148)" },
	{ "name": "Sea green", "value": "rgb(46, 139, 87)" },
	{ "name": "Seal brown", "value": "rgb(50, 20, 20)" },
	{ "name": "Seashell", "value": "rgb(255, 245, 238)" },
	{ "name": "Selective yellow", "value": "rgb(255, 186, 0)" },
	{ "name": "Sepia", "value": "rgb(112, 66, 20)" },
	{ "name": "Shadow", "value": "rgb(138, 121, 93)" },
	{ "name": "Shamrock", "value": "rgb(69, 206, 162)" },
	{ "name": "Shamrock green", "value": "rgb(0, 158, 96)" },
	{ "name": "Shocking pink", "value": "rgb(252, 15, 192)" },
	{ "name": "Sienna", "value": "rgb(136, 45, 23)" },
	{ "name": "Silver", "value": "rgb(192, 192, 192)" },
	{ "name": "Sinopia", "value": "rgb(203, 65, 11)" },
	{ "name": "Skobeloff", "value": "rgb(0, 116, 116)" },
	{ "name": "Sky blue", "value": "rgb(135, 206, 235)" },
	{ "name": "Sky magenta", "value": "rgb(207, 113, 175)" },
	{ "name": "Slate blue", "value": "rgb(106, 90, 205)" },
	{ "name": "Slate gray", "value": "rgb(112, 128, 144)" },
	{ "name": "Smalt", "value": "rgb(0, 51, 153)" },
	{ "name": "Smokey topaz", "value": "rgb(147, 61, 65)" },
	{ "name": "Smoky black", "value": "rgb(16, 12, 8)" },
	{ "name": "Snow", "value": "rgb(255, 250, 250)" },
	{ "name": "Spiro Disco Ball", "value": "rgb(15, 192, 252)" },
	{ "name": "Spring bud", "value": "rgb(167, 252, 0)" },
	{ "name": "Spring green", "value": "rgb(0, 255, 127)" },
	{ "name": "Steel blue", "value": "rgb(70, 130, 180)" },
	{ "name": "Stil de grain yellow", "value": "rgb(250, 218, 94)" },
	{ "name": "Stizza", "value": "rgb(153, 0, 0)" },
	{ "name": "Stormcloud", "value": "rgb(0, 128, 128)" },
	{ "name": "Straw", "value": "rgb(228, 217, 111)" },
	{ "name": "Sunglow", "value": "rgb(255, 204, 51)" },
	{ "name": "Sunset", "value": "rgb(250, 214, 165)" },
	{ "name": "Sunset Orange", "value": "rgb(253, 94, 83)" },
	{ "name": "Tan", "value": "rgb(210, 180, 140)" },
	{ "name": "Tangelo", "value": "rgb(249, 77, 0)" },
	{ "name": "Tangerine", "value": "rgb(242, 133, 0)" },
	{ "name": "Tangerine yellow", "value": "rgb(255, 204, 0)" },
	{ "name": "Taupe", "value": "rgb(72, 60, 50)" },
	{ "name": "Taupe gray", "value": "rgb(139, 133, 137)" },
	{ "name": "Tawny", "value": "rgb(205, 87, 0)" },
	{ "name": "Tea green", "value": "rgb(208, 240, 192)" },
	{ "name": "Tea rose", "value": "rgb(244, 194, 194)" },
	{ "name": "Teal", "value": "rgb(0, 128, 128)" },
	{ "name": "Teal blue", "value": "rgb(54, 117, 136)" },
	{ "name": "Teal green", "value": "rgb(0, 109, 91)" },
	{ "name": "Terra cotta", "value": "rgb(226, 114, 91)" },
	{ "name": "Thistle", "value": "rgb(216, 191, 216)" },
	{ "name": "Thulian pink", "value": "rgb(222, 111, 161)" },
	{ "name": "Tickle Me Pink", "value": "rgb(252, 137, 172)" },
	{ "name": "Tiffany Blue", "value": "rgb(10, 186, 181)" },
	{ "name": "Tiger eye", "value": "rgb(224, 141, 60)" },
	{ "name": "Timberwolf", "value": "rgb(219, 215, 210)" },
	{ "name": "Titanium yellow", "value": "rgb(238, 230, 0)" },
	{ "name": "Tomato", "value": "rgb(255, 99, 71)" },
	{ "name": "Toolbox", "value": "rgb(116, 108, 192)" },
	{ "name": "Topaz", "value": "rgb(255, 200, 124)" },
	{ "name": "Tractor red", "value": "rgb(253, 14, 53)" },
	{ "name": "Trolley Grey", "value": "rgb(128, 128, 128)" },
	{ "name": "Tropical rain forest", "value": "rgb(0, 117, 94)" },
	{ "name": "True Blue", "value": "rgb(0, 115, 207)" },
	{ "name": "Tufts Blue", "value": "rgb(65, 125, 193)" },
	{ "name": "Tumbleweed", "value": "rgb(222, 170, 136)" },
	{ "name": "Turkish rose", "value": "rgb(181, 114, 129)" },
	{ "name": "Turquoise", "value": "rgb(48, 213, 200)" },
	{ "name": "Turquoise blue", "value": "rgb(0, 255, 239)" },
	{ "name": "Turquoise green", "value": "rgb(160, 214, 180)" },
	{ "name": "Tuscan red", "value": "rgb(102, 66, 77)" },
	{ "name": "Twilight lavender", "value": "rgb(138, 73, 107)" },
	{ "name": "Tyrian purple", "value": "rgb(102, 2, 60)" },
	{ "name": "UA blue", "value": "rgb(0, 51, 170)" },
	{ "name": "UA red", "value": "rgb(217, 0, 76)" },
	{ "name": "UCLA Blue", "value": "rgb(83, 104, 149)" },
	{ "name": "UCLA Gold", "value": "rgb(255, 179, 0)" },
	{ "name": "UFO Green", "value": "rgb(60, 208, 112)" },
	{ "name": "UP Forest green", "value": "rgb(1, 68, 33)" },
	{ "name": "UP Maroon", "value": "rgb(123, 17, 19)" },
	{ "name": "USC Cardinal", "value": "rgb(153, 0, 0)" },
	{ "name": "USC Gold", "value": "rgb(255, 204, 0)" },
	{ "name": "Ube", "value": "rgb(136, 120, 195)" },
	{ "name": "Ultra pink", "value": "rgb(255, 111, 255)" },
	{ "name": "Ultramarine", "value": "rgb(18, 10, 143)" },
	{ "name": "Ultramarine blue", "value": "rgb(65, 102, 245)" },
	{ "name": "Umber", "value": "rgb(99, 81, 71)" },
	{ "name": "United Nations blue", "value": "rgb(91, 146, 229)" },
	{ "name": "University of California Gold", "value": "rgb(183, 135, 39)" },
	{ "name": "Unmellow Yellow", "value": "rgb(255, 255, 102)" },
	{ "name": "Upsdell red", "value": "rgb(174, 32, 41)" },
	{ "name": "Urobilin", "value": "rgb(225, 173, 33)" },
	{ "name": "Utah Crimson", "value": "rgb(211, 0, 63)" },
	{ "name": "Vanilla", "value": "rgb(243, 229, 171)" },
	{ "name": "Vegas gold", "value": "rgb(197, 179, 88)" },
	{ "name": "Venetian red", "value": "rgb(200, 8, 21)" },
	{ "name": "Verdigris", "value": "rgb(67, 179, 174)" },
	{ "name": "Vermilion", "value": "rgb(227, 66, 52)" },
	{ "name": "Veronica", "value": "rgb(160, 32, 240)" },
	{ "name": "Violet", "value": "rgb(238, 130, 238)" },
	{ "name": "Violet Blue", "value": "rgb(50, 74, 178)" },
	{ "name": "Violet Red", "value": "rgb(247, 83, 148)" },
	{ "name": "Viridian", "value": "rgb(64, 130, 109)" },
	{ "name": "Vivid auburn", "value": "rgb(146, 39, 36)" },
	{ "name": "Vivid burgundy", "value": "rgb(159, 29, 53)" },
	{ "name": "Vivid cerise", "value": "rgb(218, 29, 129)" },
	{ "name": "Vivid tangerine", "value": "rgb(255, 160, 137)" },
	{ "name": "Vivid violet", "value": "rgb(159, 0, 255)" },
	{ "name": "Warm black", "value": "rgb(0, 66, 66)" },
	{ "name": "Waterspout", "value": "rgb(0, 255, 255)" },
	{ "name": "Wenge", "value": "rgb(100, 84, 82)" },
	{ "name": "Wheat", "value": "rgb(245, 222, 179)" },
	{ "name": "White", "value": "rgb(255, 255, 255)" },
	{ "name": "White smoke", "value": "rgb(245, 245, 245)" },
	{ "name": "Wild Strawberry", "value": "rgb(255, 67, 164)" },
	{ "name": "Wild Watermelon", "value": "rgb(252, 108, 133)" },
	{ "name": "Wild blue yonder", "value": "rgb(162, 173, 208)" },
	{ "name": "Wine", "value": "rgb(114, 47, 55)" },
	{ "name": "Wisteria", "value": "rgb(201, 160, 220)" },
	{ "name": "Xanadu", "value": "rgb(115, 134, 120)" },
	{ "name": "Yale Blue", "value": "rgb(15, 77, 146)" },
	{ "name": "Yellow", "value": "rgb(255, 255, 0)" },
	{ "name": "Yellow Orange", "value": "rgb(255, 174, 66)" },
	{ "name": "Yellow green", "value": "rgb(154, 205, 50)" },
	{ "name": "Zaffre", "value": "rgb(0, 20, 168)" },
	{ "name": "Zinnwaldite brown", "value": "rgb(44, 22, 8)" }
];