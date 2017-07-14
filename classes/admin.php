<?php

/**
 * Provides all functions for the plugins page and the admin page
 *
 * @author Stephen
 */

class localmoney {
	
	/**
	 * Constructor. Sets up main filter and other hooks.
	 */

	 public function __construct() {

		/*
		 * Create 'Settings' link on the plugin page
		 */

		add_filter('plugin_action_links', array($this,'lm_action_links'), 10, 2);
		register_activation_hook(dirname(dirname(__FILE__)).'/localmoney.php', array($this,'lm_activation'));

		/*
		 * Select the location of the menu item
		 */

		add_action( 'admin_menu', array($this,'lm_menu_item' ));
		add_action('admin_init', array($this,'lm_admin_init'));
		register_deactivation_hook(dirname(dirname(__FILE__)).'/localmoney.php', array($this,'lm_deactivation'));

	}
	
	/**
	 * Creates 'Settings' link on the plugins page when the plugin is activated.
	 * 
	 * @staticvar	string	$this_plugin	Path to the LocalMoney root .php file
	 * @param		array	$links			List of links for this plugin
	 * @param		string	$file			File path passed to the function
	 * @return		array					Returns $links list of links
	 */

	function lm_action_links($links, $file) {
		static $this_plugin;

		if (!$this_plugin) {
			$this_plugin = 'localmoney/localmoney.php';
		}

		if ($file == $this_plugin) {
			$settings_link = '<a href="' . get_bloginfo('wpurl') . '/wp-admin/options-general.php?page=localmoney">Settings</a>';
			array_unshift($links, $settings_link);
		}

		return $links;
	}
	
	/*
	 * On plugin activation set up scheduled event to make hourly requests for the
	 * latest currency rates.
	 * 
	 * Then reset the plugin folder as defined in javascript.js
	 */
	
	function lm_activation() {
		if( !wp_next_scheduled( 'get_remote_rates_hk' ) ) {
			wp_schedule_event( time(), 'hourly', 'get_remote_rates_hk' );
			add_action( 'get_remote_rates_hk', 'lm_get_remote_rates' );
		}

		$httpjs = get_bloginfo('wpurl').'/wp-content/plugins/localmoney/';
		$filejs = dirname(dirname(__FILE__)).'/javascript.js';
		$js = file_get_contents($filejs);
		$js = preg_replace("#(var pluginpath = ').*('; // Overriden on activation)#","$1$httpjs$2",$js);
		file_put_contents($filejs,$js);
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
	/**
	 * Create the options page for admin level only and map to the function.
	 */

	function lm_menu_item() {
		add_options_page( __('Local Money Options','localmoney'), __('LocalMoney','localmoney'), 'manage_options', 'localmoney', array($this,'lm_options') );
		//				 $page_title,								$menu_title,					$capability,	$menu_slug, $function
	}

	/**
	 * Function to set up the options page
	 */

	function lm_options() {
		if ( !current_user_can( 'manage_options' ) )  {
			wp_die( __( 'You do not have sufficient permissions to access this page.', 'localmoney' ) );
		}

		/*
		 * HTML to define the options page
		 */
?>

		<div class="wrap">
			<?php screen_icon(); ?>
			<h2>LocalMoney Settings</h2>

			<form method="post" action="options.php">

				<?php settings_fields( 'localmoney_options' ); ?>
				<?php //				$option_group?>
				<?php do_settings_sections( 'localmoney' ); ?>
				<?php //				$page must match $page in add_settings_section(). ?>
				<?php submit_button(); ?>

			</form>

			<p style="font-style: italic">
				<?php _e("Please note that the currency conversions supplied by the LocalMoney plugin are for guidance and entertainment value only and are not intended for trading purposes, ".
				"just like gardening implements are not intended for open heart surgery (I can't believe I have to tell people this!)",'localmoney'); ?>
			</p>
		</div>

<?php

	}

	/**
	 * Define the Options settings and controls
	 */

	/*
	 * Set up the settings, section and API field
	 */

	function lm_admin_init() {
		register_setting( 'localmoney_options', 'localmoney_options', array($this,'lm_options_validate'));
		//					$option_group,		$option_name, $sanitize_callback 
			add_settings_section('api', __('API','localmoney'), array($this,'lm_section_html'), 'localmoney');
			//					$id,	$title,					$callback,		$page
				add_settings_field('api_key', __('OpenExchangeRates API Key:','localmoney'), array($this,'lm_setting_string'), 'localmoney', 'api');
				//					$id,		$title,											$callback,		$page,		$section, $args

			add_settings_section('base', __('Base Currency','localmoney'), array($this,'lm_base_html'), 'localmoney');
			//					$id,	$title,					$callback,		$page
				add_settings_field('base', __('Base Currency:','localmoney'), array($this,'lm_base_string'), 'localmoney', 'base');
				//					$id,		$title,							$callback,		$page,		$section, $args
	}

	/*
	 * Define the HTML for the API section
	 */

	function lm_section_html() {
		_e('<p>Before the LocalMoney plugin will do anything you must head over to <a href="http://openexchangerates.org" target="_blank">openexchangerates.org</a> and get yourself an API key.</p>','localmoney');
		_e('It\'s OK, I\'ll wait…','localmoney');
	}

	/*
	 * HTML for the API key field
	 */

	function lm_setting_string() {
		$options = get_option('localmoney_options');
		//						$option_group
		echo "<input id='api_key' name='localmoney_options[api_key]' size='40' type='text' value='{$options['api_key']}' />";
	}

	/*
	 * Define the HTML for the Base Currency section
	 */

	function lm_base_html() {
		_e('LocalMoney converts between the following currencies:','localmoney');
	}

	/*
	 * HTML for the Base Currency selection
	 * 
	 * Uses the javascript file as the basis for the list of currencies and their
	 * respective countries.
	 */

	function lm_base_string() {
		$options = get_option('localmoney_options');
		$base_currency = $options['base_currency'];
		$collection = array();
		if ($base_currency == '') $base_currency = 'USD';
		//						$option_group
		$file = file_get_contents(dirname(dirname(__FILE__)).'/javascript.js');
		preg_match_all('/\[\'([A-Z]{3})\',\'(.*?)\',\'[,.]\'\];\t*?\/\/\t(.*)\n/', $file, $matches);
		$n = sizeof($matches[1]);
		echo "<style>.currency{background:#EEE;border:1px solid #DDD;border-radius:9em;padding:0.1em 1em;margin:0.25em;display:inline-block}.currency-selection{}</style>\n";
		echo "<div class='currency-selection'>\n";
		for ($i=0;$i<$n;$i++) {
			$code = $matches[1][$i];
			if (!$collection[$code]) {
				$pattern = $matches[2][$i];
				$name = $matches[3][$i];
				echo "<label class='currency'><input type='radio' name='localmoney_options[base_currency]' value='$code:$pattern'";
				if ($base_currency == "$code:$pattern") echo ' checked';
				echo "> $pattern $name</label>\n";
				$collection[$code] = true;
			}
		}
		echo "</div>\n";
	}

	/*
	 * Input validation
	 * 
	 * Checks that the API key is a 32-character string of lower case letters and numbers
	 * 
	 * Uses the API key to download exchange rate data.
	 * 
	 * Gives an error if the data does not include a rates declaration.
	 */

	function lm_options_validate($input) {
		$newinput['api_key'] = trim($input['api_key']);
		if (preg_match('/^[a-z0-9]{32}$/', $newinput['api_key']) === 1) {
				
			/*
			 * Try to fetch Open Exchange-Rates JSON data using given API key
			 * and test result to presence of error code.
			 */
				
			$file = 'latest.json';
			$response = wp_remote_get("http://openexchangerates.org/api/$file?app_id={$newinput['api_key']}");
			$json = $response['body'];
			$json_check = json_decode($json);
			if (isset($json_check->error)) {
				
				/*
				 * Extract error message from JSON
				 * 
				 * Turn url and e-mail address into a link
				 * 
				 * Use the WP API to display the error.
				 */

				$error = $json_check->description;
				$error = preg_replace('|http(s?)://([a-z0-9./]*)|',"<a href='http$1://$2'>http$1://$2</a>",$error);
				$error = preg_replace('|([a-z]+[a-z0-9.]*@[a-z0-9.]*\.[a-z]{2,3})|',"<a href='mailto:$1'>$1</a>",$error);

				add_settings_error('general','settings_updated',	"There seems to be something wrong with your API key, '{$newinput['api_key']}'. The following error was returned:".
																	"<p style='font-weight:bold'>'".$error."'</p>".
																	"<p>Your key has been saved but it won't do anything.</p>",'error');
			} elseif (isset($json_check->rates)) {
				
				/*
				 * Do nothing since no error occured
				 */
				
			} else {
				
				/*
				 * Display an unknown error notice.
				 */
				
				add_settings_error('general','settings_updated',	"There seems to be something wrong with your API key, '{$newinput['api_key']}'. An unknown error occurred.",'error');
			}
		} else {
			add_settings_error('general','settings_updated',	"Your API key is wrong. It should be 32 lower case letters and numbers. You used '{$newinput['api_key']}'.",'error');
		}
		
		/*
		 * Check the validity of the base currency selected
		 */
		
		if (preg_match('/[A-Z]{3}.*/', $input['base_currency']) != true) {
			add_settings_error('general','settings_updated',	"There seems to be something wrong with your currency selection, '{$input['base_currency']}'.</p>",'error');
		} else {
			$newinput['base_currency'] = $input['base_currency'];
		}
		
		/*
		 * Return sanitized data
		 */
		
		return $newinput;
	}

	/*
	 * On deactivation remove scheduled event
	 */

	function lm_deactivation() {
		wp_clear_scheduled_hook('get_remote_rates_hk');
	}


}

 

?>
