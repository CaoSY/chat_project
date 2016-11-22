<?php
	$userlist = simplexml_load_file("data/userlist.xml");
	$newUser = $userlist -> addChild("user");
	$newUser -> addChild("name", $_POST['username']);
	$newUser -> addChild("password", $_POST['password']);
	$userlist -> saveXML("data/userlist.xml");
	$response = new SimpleXMLElement("<?xml version='1.0' standalone='yes'?><result></result>");
	$response -> addChild("sucess", "true");
	print($response -> asXML());
?>