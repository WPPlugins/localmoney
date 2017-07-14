<?php
	
	$ip = isset($_GET['ip']) ? $_GET['ip'] : false;
	if (!$ip) {
		$ip = $_SERVER["REMOTE_ADDR"];
		if ($_SERVER['HTTP_X_FORWARDED_FOR'] != '') $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
	}

	require_once('ip2c.php');
	$ip2c = new ip2country(false);
	$res = $ip2c->get_country($ip);
	if ($res == false) {
	  $data = array('error'=>'not found');
	} else {
	  $data = $res;
	}
	$json = json_encode($data);
	header('Content-Type: application/json');
	echo $json;
	
?>
