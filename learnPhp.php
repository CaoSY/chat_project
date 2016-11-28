<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Chat</title>
	</head>
	<body>
		<?php $condition = false; ?>
		<?php if($condition): ?>
		<h1> True </h1>
		<?php else: ?>
		<h1> False </h1>
		<?php endif ?>
	</body>
</html>
<?php
$userlist = simplexml_load_file("data/userlist.xml") or die("Error: Cannot create object");
$authenticatedUser = null;
foreach($userlist -> Children() as $user){
	$password = hash("sha512", $_POST['username']+$_POST['password']);
	if(strcmp($_POST['username'], $user->name)==0 && strcmp($password, $user->password)==0) {
		$authenticatedUser = $user;
		break;
	}
}
?>
