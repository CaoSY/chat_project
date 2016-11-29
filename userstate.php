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
	<body class="scrollbar">
		<div class="background-div"></div>
		<div class="container board">
			<div class="col-xs-12 no-padding">
				<div style="height: 1px; background-color: #EEEEEE; width: 100%;"></div>
				<div id="contact-list" class="scrollbar">
					<!--
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
					-->
				</div>
			</div>
		</div>
		<script src="lib/jquery-3.1.1.min.js"></script>
		<script src="lib/bootstrap.min.js"></script>
		<script src="js/common.js"></script>
		<script src="js/room.js"></script>
		<script>
		<?php
			$userlist = simplexml_load_file("./data/userlist.xml") or die("Error: Cannot create object");

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
			$(window).off("beforeunload");
			$(window).on("unload");
		</script>
	</body>
</html>