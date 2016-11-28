<?php
	$eventlist = simplexml_load_file("../data/eventlist.xml") or die("Error: Cannot create object");
	$newEvent = $eventlist -> addChild("event");
	$newEvent -> addChild("type", "message");
	$newEvent -> addChild("timestamp", $_POST["timestamp"]);
	$newEvent -> addChild("from", $_POST["from"]);
	$newEvent -> addChild("to", $_POST["to"]);
	$newEvent -> addChild("content", $_POST["content"]);
	$eventlist -> saveXML("../data/eventlist.xml");
	echo $newEvent -> asXML();
?>