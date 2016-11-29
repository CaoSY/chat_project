<?php
	$userlist = simplexml_load_file("../data/userlist.xml") or die("Error: Cannot create object");
	$authenticatedUser = null;
	foreach($userlist -> Children() as $user){
		if(strcmp($_POST['username'], $user->name)==0) {
			$authenticatedUser = $user;
			break;
		}
	}
	if(!is_null($authenticatedUser) && (string)($authenticatedUser -> online) != "false") {
		$authenticatedUser -> online = "false";
		$userlist -> saveXML("../data/userlist.xml");
		
		$eventlist = simplexml_load_file("../data/eventlist.xml") or die("Error: Cannot create object");
		$newEvent = $eventlist -> addChild("event");
		$newEvent -> addChild("type", "logout");
		$newEvent -> addChild("timestamp", round(microtime(true)*1000));
		$newEvent -> addChild("from", $authenticatedUser->name);
		$newEvent -> addChild("to", "room");
		$newEvent -> addChild("content", "");
		$eventlist -> saveXML("../data/eventlist.xml");
	}
?>