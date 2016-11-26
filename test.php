<?php
	$response = new SimpleXMLElement("<?xml version='1.0' standalone='yes'?><result></result>");
	//$response -> addChild("sucess", "true");
	print_r($response);
	$response -> sucess ="true";
	$str = $response -> asXML("test.xml");
	print_r("<p>$str</p>");

?>