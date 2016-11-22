<?php
	$userlist = simplexml_load_file("data/userlist.xml") or die("Error: Cannot create object");
	$response = new SimpleXMLElement("<?xml version='1.0' standalone='yes'?><auth></auth>");
	foreach($userlist -> Children() as $user){
		if(strcmp($_POST['username'], $user->name)==0) {
			$response -> addChild("pass", "true");
			$info = $response -> addChild("info");
			$info -> addChild("name", $user->name);
			print($response -> asXML());
			exit;
		}
	}
	$response -> addChild("pass", "false");
	print($response -> asXML());
?>