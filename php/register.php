<?php
	$response = new SimpleXMLElement("<?xml version='1.0' standalone='yes'?><result></result>");
	try{
		$userlist = simplexml_load_file("../data/userlist.xml");
		foreach($userlist -> children() as $oldUser) {
			$userAttr = $oldUser -> attributes();
			if(strcmp($userAttr["id"], $_POST['username']) == 0) {
				throw new Exception("Name has been used");
			}
		}
		$newUser = $userlist -> addChild("user");
		$newUser -> addChild("name", $_POST['username']);
		$password = hash("sha256", $_POST['username'].$_POST['password']);
		$newUser -> addChild("password", $password);
		$imgExtension = pathinfo($_FILES["profile"]["name"], PATHINFO_EXTENSION);
		$imgName = "$password.$imgExtension";
		move_uploaded_file($_FILES["profile"]["tmp_name"], "../data/images/$imgName");
		$newUser -> addChild("imageSource", $imgName);
		$newUser -> addChild("online", "false");
		$newUser -> addChild("authenticate", "false");
		$userlist -> saveXML("../data/userlist.xml");
		
		$eventlist = simplexml_load_file("../data/eventlist.xml") or die("Error: Cannot create object");
		$newEvent = $eventlist -> addChild("event");
		$newEvent -> addChild("type", "register");
		$newEvent -> addChild("timestamp", round(microtime(true)*1000));
		$newEvent -> addChild("from", $_POST["username"]);
		$newEvent -> addChild("to", "room");
		$newEvent -> addChild("content", $imgName);
		$eventlist -> saveXML("../data/eventlist.xml");
		
		$response -> addChild("sucess", "true");
		$response -> addChild("user", $newUser->asXML());
	}catch(Exception $e) {
		$response -> sucess = "false";
		$response -> addChild("error", $e -> getMessage());
	}finally {
		print($response -> asXML());
	}
?>