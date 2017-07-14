<?php
require_once('ip2c.php');
$caching = false;
$ip2c = new ip2country($caching);
$res = $ip2c->get_country("164.127.73.114");
if ($res == false)
  echo "not found";
else
{
  $o2c = $res['id2'];
  $o3c = $res['id3'];
  $oname = $res['name'];
  echo "$o2c $o3c $oname"; // will output IL ISR ISRAEL
}
?>
