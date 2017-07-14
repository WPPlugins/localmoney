<?php
	/*
	Plugin Name:	LocalMoney
	Plugin URI:		
	Description:	Converts all prices in a post to the site visitor's local currency.
	Author:			Steve Mulligan
	Version:		1.0.6
	Author URI:		http://www.stephenmulligan.co.uk
	*/

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
	 * Make it international
	 */ 

	load_plugin_textdomain('localmoney', false, dirname(__FILE__) . '/languages' );
	
	/*
	 * Run different versions of the class for admin and public
	 */

	if (is_admin()) {

		include 'classes/admin.php';
		
	} else {

		include 'classes/frontend.php';
	}
	
	/*
	 * Instantiate the class
	 */
	
	$localmoney = new localmoney();
	

?>
