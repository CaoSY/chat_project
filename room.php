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
?>
<?php if(is_null($authenticatedUser)): ?>
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Error</title>
	</head>
	<body>
		<h1>The user is not authenticated. Go back and re-log in.</h1>
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
			<div class="col-sm-4 no-padding">
				<div id="user-profile">
					<img src=<?php echo file_exists($imgSrc)? "'$imgSrc'" : "'img/default-user-image.svg'" ?> class="profile-img img-circle"/>
					<div class="dropdown user-menu-pane pull-right">
						<a class="option dropdown-toggle" id="user-menu" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-option-vertical"></i></a>
						<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="user-menu">
							<li><a>Update profile</a></li>
							<li><a>Log out</a></li>
						</ul>
					</div>
				</div>
				<form role="form" class="no-padding">
					<div class="form-group has-feedback square-corner no-margin">
						<input type="text" class="form-control square-corner input-lg" placeholder="search or start a new chat" />
						<i class="form-control-feedback glyphicon glyphicon-search search-icon"></i>
					</div>
				</form>
				<div style="height: 1px; background-color: #EEEEEE; width: 100%;"></div>
				<div id="contact-list" class="scrollbar">
					<div class="contact-list-item">
						<div class="avatar">
							<img src="img/default-user-image.svg" class="item-img img-circle center-block" />
						</div>
						<div class="item-body">
							<div class="item-title">
								<p class="item-name">sed do eiusmod tempo</p>
								<span class="item-time">2016/11/24</span>
							</div>
							<div class="item-info">world</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-8 no-padding" id="content">
				<header id="content-head">
					<div class="chat-avatar">
						<img src="img/default-group-image.svg" class="chat-avatar-img img-circle"/>
					</div>
					<div class="chat-header">
						<div class="chat-name"><span> do eiusmod tempo</span></div>
						<div class="chat-members">You, he, she, I</div>
					</div>
					<div class="dropdown chat-menu-pane">
						<a class="option dropdown-toggle no-margin" id="chat-menu" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-option-vertical"></i></a>
						<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="chat-menu">
							<li><a>Update profile</a></li>
							<li><a>Mute</a></li>
						</ul>
					</div>
				</header>
				<div id="chat-content">
					<div class="chat-background"></div>
					<div class="message-list scrollbar">
						<div class="message">
							<div class="system-message-body">
								<span class="system-message">Somebody creates this group</span>
							</div>
						</div>
						<div class="message">
							<div class="system-message-body">
								<span class="system-notification">Network failure</span>
							</div>
						</div>
						<div class="message clearfix">
							<div class="chat-message pull-left">
								<div class="message-in">
									<div class="message-author">Lorem ipsum</div>
									<div class="message-text">Hello, world! lalala!</div>
									<div class="message-meta">17:00</div>
								</div>
							</div>
						</div>
						<div class="message clearfix">
							<div class="chat-message pull-right message-out">
								<div class="message-author"></div>
								<div class="message-text">Generator for grandomized typographic filler text. Sorry, this .... Most text editors like MS Word or Lotus Notes generate random lorem text when needed, either as ...</div>
								<div class="message-meta">17:00</div>
							</div>
						</div>
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
					<div class="edit-area scrollbar"><span id="edit-content" contenteditable="true">Hello, world!</span></div>
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
		</script>
	</body>
</html>
<?php endif ?>