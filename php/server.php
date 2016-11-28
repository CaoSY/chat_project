<?php
	function response_query($timestamp) {
		$file_size = filesize("../data/eventlist.xml");
		$eventlist = simplexml_load_file("../data/eventlist.xml") or die("Error: Cannot create object");
		$response = new SimpleXMLElement("<?xml version='1.0' standalone='yes'?><result></result>");
		$response -> addChild("filesize", $file_size);
		$new_event_arr = $response -> addChild("newEvents");
		foreach($eventlist -> Children() as $event) {
			if((int)($event->timestamp) > $timestamp) {
				$new_event = $new_event_arr -> addChild("event");
				$new_event -> addChild("type", $event->type);
				$new_event -> addChild("timestamp", $event->timestamp);
				$new_event -> addChild("from", $event->from);
				$new_event -> addChild("to", $event->to);
				$new_event -> addChild("content", $event->content);
			}
		}
		echo $response -> asXML();
	}

	$origin_file_size = (int)$_POST["filesize"];
	if(filesize("../data/eventlist.xml") > $origin_file_size) {
		response_query((int)$_POST["timestamp"]);
	}else {
		set_time_limit(60);
		$max_check_num = 60;
		for($check_count=0; $check_count<$max_check_num; ++$check_count) {
			clearstatcache();
			if(filesize("../data/eventlist.xml") > $origin_file_size) {
				response_query((int)$_POST["timestamp"]);
				break;
			}
			sleep(0.5);
		}
	}
?>