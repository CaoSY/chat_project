<?php
	$userlist = simplexml_load_file("../data/userlist.xml") or die("Error: Cannot create object");
	$response = new SimpleXMLElement("<?xml version='1.0' standalone='yes'?><auth></auth>");
	foreach($userlist -> Children() as $user){
		$password = hash("sha512", $_POST['username']+$_POST['password']);
		if(strcmp($_POST['username'], $user->name)==0 && strcmp($password, $user->password)==0) {
			$response -> addChild("pass", "true");
			$info = $response -> addChild("info");
			$info -> addChild("name", $user->name);
			$info -> addChild("password", $user->password);
			print($response -> asXML());
			exit;
		}
	}
	$response -> addChild("pass", "false");
	print($response -> asXML());
?>