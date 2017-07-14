<?php

	/**
	 * LocalMoney
	 * 
	 * A cache-compatible WordPress plugin which recalculates all prices in a post or
	 * page in the viewers local currency. LocalMoney relies on the WP-cron system to 
	 * fetch the rates from openexchangerates.org on an hourly basis and then uses
	 * javascript to lookup the visitor's location and fetch the appropriate rate data.
	 * This means that, unlike some plugins I could mention, LocalMoney is compatible
	 * with caching plugins.
	 */

	/*
	 * Load the cached rates data and serve it as a JSON object
	 */


	$json = file_get_contents('cache.txt');

	header('Content-Type: application/json');
	
	echo $json;
	
?>