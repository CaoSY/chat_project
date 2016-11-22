<?php
$xml=simplexml_load_file("data/userlist.xml") or die("Error: Cannot create object");
print_r($xml);
?>