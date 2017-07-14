<?php

/**
 * Description of install-class
 *
 * @author Stephen
 */

class localmoney {

	 public function __construct() {

		add_action('wp_enqueue_scripts', array($this,'lm_enqueue_scripts'));
		add_filter('the_content', array($this,'localmoney'));
		add_filter('the_excerpt', array($this,'localmoney'));
//		add_action('get_remote_rates_hk', array($this,'lm_get_remote_rates'));

	}
	
	/*
	 * Enqueue the javascript into the footer of the page.
	 */

	function lm_enqueue_scripts() {
		wp_enqueue_script('lm_client_side', 
						  plugins_url( 'javascript.js', dirname(__FILE__) ),
						  array('jquery'), 
						  '0.3', 
						  true);
	}

	/*
	 * When serving a post or listing excerpts trigger the marking of prices in the
	 * page.
	 */

	function localmoney($content) {

		/*
		 * Get the options for the plugin
		 */

		$options = get_option('localmoney_options');
		$base = explode(':',$options['base_currency']);
		$base_currency = $base[0];
		$old_pattern = $base[1];
		$old_regex = '/[^a-zA-Z]'.str_replace(array('*','$'),array('[0-9]*\.?[0-9]*','\$'),$old_pattern).'/';
		
		/*
		 * Load the rates data into an array
		 */

		$json = file_get_contents(dirname(dirname(__FILE__)).'/cache.txt');
		$json_object = json_decode($json,true);
		$rates_base = $json_object['base'];
		$rates = $json_object['rates'];

		$rate = 1/$rates[$base_currency];

		$callback = function($match) use ($rate) {
			return localmoney::lm_convert($match,$rate);
		};

		$content = preg_replace_callback($old_regex, $callback, $content);

		// Done
		return $content;
	}

	function lm_convert($match,$rate) {
		$match = $match[0];
		$chars = preg_split('//u',$match);
		$match = '';
		foreach ($chars as $c) {
			if ($c != '' && strpos('0123456789.',$c) !== false) $match .= $c;
		}
		$match = preg_replace('/[,.](\d{3})([^0-9]|$)/','$1',$match);
//		$cents = strpos($match,'.') !== false ? 2 : 0;
//		$match = preg_replace('/^[^0-9]*([0-9.]*).*$/','$1',$match);
//		$number = number_format($match*$rate,$cents,'.','');
		$number = $match*$rate;
		return $chars[1].'<span class="currency">$'.$number.'</span>';
	}

	/*
	 * Fetch the currency rates from openexchangerates.org and chaches the file
	 * on the local server.
	 */

	function lm_get_remote_rates() {

		/*
		 * Set up name of file to send, options and API key.
		 */

		$file = 'latest.json';
		$options = get_option('localmoney_options');
		$appId = $options['api_key'];

		/*
		 * Use the WP HTTP API to get the data file
		 */

		$response = wp_remote_get("http://openexchangerates.org/api/$file?app_id=$appId");
		$json = $response['body'];

		/*
		 * Save the object to the cache file
		 */

		file_put_contents(dirname(dirname(__FILE__)).'/cache.txt',$json);

	}

}



?>
