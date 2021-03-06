<?php
	$userlist = simplexml_load_file("data/userlist.xml") or die("Error: Cannot create object");
	$authenticatedUser = null;
	foreach($userlist -> Children() as $user){
		$password = hash("sha256", $_POST['username'].$_POST['password']);
		if(strcmp($_POST['username'], $user->name)==0 && strcmp($password, $user->password)==0) {
			$authenticatedUser = $user;
			break;
		}
	}
	
	$authentication = null;
	if(!is_null($authenticatedUser) && (string)($authenticatedUser->authenticate)=="true") {
		$authentication = "true";
		$authenticatedUser -> authenticate = "false";
		$authenticatedUser -> online = "true";
		$userlist -> saveXML("data/userlist.xml");

		$eventlist = simplexml_load_file("data/eventlist.xml") or die("Error: Cannot create object");
		$newEvent = $eventlist -> addChild("event");
		$newEvent -> addChild("type", "login");
		$newEvent -> addChild("timestamp", round(microtime(true)*1000));
		$newEvent -> addChild("from", $authenticatedUser->name);
		$newEvent -> addChild("to", "room");
		$newEvent -> addChild("content", "");
		$eventlist -> saveXML("data/eventlist.xml");
	}
?>
<?php if(is_null($authenticatedUser) || is_null($authentication) || $authentication!="true"): ?>
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Error</title>
		<style>
			body {
				text-align: center;
			}
		</style>
	</head>
	<body>
		<h1>The user is not authenticated.</h1>
		<h1><a href="index.html">Go back and re-log in.</a></h1>
	</body>
</html>
<?php else: ?>
<?php
	$imgSrc = 'data/images/'.$authenticatedUser->imageSource;
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="uf-8" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Cache-Control" content="no-cache, must-revalidate" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Chat</title>
		<link rel="stylesheet" href="lib/bootstrap.min.css" />
		<link rel="stylesheet" href="css/common.css" />
		<link rel="stylesheet" href="css/board.css" />
	</head>
	<body>
		<div class="background-div"></div>
		<div class="container board">
			<div class="col-xs-10 col-xs-offset-1 no-padding" id="content">
				<header id="content-head">
					<div class="chat-avatar">
						<img src=<?php echo file_exists($imgSrc)? "'$imgSrc'" : "'img/default-user-image.svg'" ?> class="chat-avatar-img img-circle"/>
					</div>
					<div class="chat-header">
						<div class="chat-name"><span>Public Room</span></div>
						<div class="chat-members"></div>
					</div>
					<div class="dropdown chat-menu-pane">
						<a class="option dropdown-toggle no-margin" id="chat-menu" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-option-vertical"></i></a>
						<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="chat-menu">
							<li><a id="mute">Mute <i class="glyphicon glyphicon-ok"></i></a></li>
							<li><a id="logout">Log out</a></li>
						</ul>
					</div>
				</header>
				<div id="chat-content">
					<div class="chat-background"></div>
					<div class="message-list scrollbar">
						<!-- -->
					</div>	
				</div>
				<div id="text-editor">
					<div class="btn-group" role="group" id="edit-helper">
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default dropdown-toggle" id="font-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-font" data-toggle="tooltip" title="Font"></i></button>
							<ul class="dropdown-menu scrollbar" aria-labelledby="font-button">
								<!-- `<li><a style='font-family:${currentValue.value}'>${currentValue.name}</a></li>` -->
							</ul>
						</div>
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default dropdown-toggle" id="bold-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-bold" data-toggle="tooltip" title="Bold"></i></button>
							<ul class="dropdown-menu scrollbar" aria-labelledby="bold-button">
								<!-- `<li><a style="font-weight:${currentValue.value}">${currentValue.name}</a></li>` -->
							</ul>
						</div>
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default" id="italic-button"><i class="glyphicon glyphicon-italic" data-toggle="tooltip" title="Italic"></i></button>
						</div>
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default dropdown-toggle" id="size-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-text-size" data-toggle="tooltip" title="Text Size"></i></button>
							<ul class="dropdown-menu scrollbar" aria-labelledby="size-button">
								<!-- `<li><a style="font-size:${currentValue.value}">${currentValue.name}</a></li>` -->
							</ul>
						</div>
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default dropdown-toggle" id="color-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-text-color" data-toggle="tooltip" title="Text Color"></i></button>
							<ul class="dropdown-menu scrollbar" aria-labelledby="color-button">
								<!-- `<li><a style="color:${currentValue.value};">${currentValue.name}</a></li>` -->
							</ul>
						</div>
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default dropdown-toggle" id="background-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-text-background" data-toggle="tooltip" title="Background Color"></i></button>
							<ul class="dropdown-menu scrollbar" aria-labelledby="background-button">
								<li><a style="background-color:rgb(255, 255, 255);color:rgba(0,0,0,0);">Default</a></li>
								<li><a style="background-color:rgb(227, 38, 54);color:rgba(0,0,0,0);">crimson</a></li>
								<li><a style="background-color:rgb(255, 3, 62);color:rgba(0,0,0,0);">American rose</a></li>  
							</ul>
						</div>
					</div>
					<div class="edit-area scrollbar"><span id="edit-content" contenteditable="true"></span></div>
					<!--<textarea class="scrollbar"></textarea>-->
					<button type="button" class="btn btn-default pull-right" style="margin-top: 5px; margin-right: 10px;" id="send">Send</button>
				</div>
			</div>
		</div>
		<!--
		<div style="height: 2px; background-color: black; width: 100%;"></div>
		-->
		<script src="lib/jquery-3.1.1.min.js"></script>
		<script src="lib/bootstrap.min.js"></script>
		<script src="js/common.js"></script>
		<script src="js/room.js"></script>
		<script>
		<?php
			$userlist = simplexml_load_file("./data/userlist.xml") or die("Error: Cannot create object");
			$User = array();
			$User["name"] = (string)($authenticatedUser -> name);
			$User["imgSrc"] = (string)($authenticatedUser -> imageSource);
			print("var User=".json_encode($User).";");

			foreach($userlist -> Children() as $user){
				$listItem = array();
				$listItem["name"] = (string)($user -> name);
				$listItem["imgSrc"] = (string)($user -> imageSource);
				$listItem["online"] = (string)($user -> online);
				$UserList[$listItem["name"]] = $listItem;
			}
			print("var UserList=".json_encode($UserList).";");

			$eventlist = simplexml_load_file("./data/eventlist.xml") or die("Error: Cannot create object");
			$eventarr = array();
			foreach($eventlist -> Children() as $event) {
				$eventItem = array();
				$eventItem["type"] = (string)($event -> type);
				$eventItem["timestamp"] = (string)($event -> timestamp);
				$eventItem["from"] = (string)($event -> from);
				$eventItem["to"] = (string)($event -> to);
				$eventItem["content"] = (string)($event -> content);
				array_push($eventarr, $eventItem);
			}
			print("var EventList=".json_encode($eventarr).";");	

			print("var FileSize=".filesize("./data/eventlist.xml").";");
		?>
			var NewWindow = null;
		</script>
		<audio src="demonstrative.mp3" id="sound"></audio>
	</body>
</html>
<?php endif ?>