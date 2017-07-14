=== LocalMoney ===
Contributors: SteveMulligan
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=steve@machinesthatgobing.com
Tags: prices,currency,currency rates,converter,cache,localization,ecommerce,exchange rates,financial,travel,product,review
Requires at least: 2.7
Tested up to: 3.6.1
Stable tag: 1.0.5
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A cache-compatible plugin which converts all prices in a post or page into the viewer's
local currency.

== Description ==

A cache-compatible WordPress plugin which converts all prices of the currency of
your choice in a post or page in the viewer's local currency. LocalMoney relies
on the WP-cron system to fetch and cache the rates from 
[Open Exchange Rates](http://openexchangerates.org "The openexchangerates.org site") 
on an hourly basis and then uses javascript to lookup the visitor's location and 
fetch the appropriate rate data. This means that, unlike some plugins I could mention, 
LocalMoney is compatible with caching plugins.

LocalMoney, once configured, immediately (or as soon as your cache updates) acts
on all your posts and pages without you having to mark up the prices in your text.

= Features =

1. Determines the reader's country via IP address, using IP2C
1. Resolves proxies with the 'forwarded-for' header so AOL-compatible
1. If IP2C fails uses the language settings and timezone offset to guess location
1. Obtains exchange rates from openexchangerates.org
1. Uses AJAX so that converting currency values doesn't delay page load times
1. Caches exchange rates locally to minimize calls to openexchangerates.org
1. Output prices matched to format of input prices (i.e. with or without cents)

= How to Use =

Once LocalMoney is installed it will take any page on which US dollar prices are
displayed and convert them to the visitors local currency. If your posts are written
with another currency you can change the base currency in the Settings > LocalMoney
page.

== Installation ==

1. Upload `plugin-name.php` to the `/wp-content/plugins/` directory.
1. Activate the plugin through the 'Plugins' menu in WordPress.
1. Go to openexchangerates.org and sign up for a free account.
1. Copy your API key (should be a string of 32 alphanumeric characters).
1. Go to Settings > LocalMoney and paste the API key into the field.
1. On the same page if your own currency is not the US Dollar select it.
1. If you are using a caching system you may want to empty your cache in order to benefit from the plugin immediately.

== Internationalization (i18n) ==

Currently LocalMoney has not been translated to any languages other than English.

If you wish, feel free to create a translation. Here are the basic steps:

1. Copy "localmoney-en.po" to "localmoney-LANG_COUNTRY.po" - fill in LANG and COUNTRY with whatever you use for WPLANG in wp-config.php.
1. Grab a transalation editor. [POedit](http://www.poedit.net/) works for us.
1. Translate each line.
1. Send your new localmoney-LANG_COUNTRY.po file to steve@machinesthatgobing.com.
1. Your translation will be incorporated in the next release.

== Frequently Asked Questions ==

= What do I have to do to tell LocalMoney where the prices are on my page? =

Nothing!

= How does LocalMoney decide which currency to convert to? =

In order to make the lookup process more robust the LocalMoney plugin uses a main
and a fallback mechanism to lookup a visitor's location.

The main system is the IP2C (IP to country) lookup service which is included with
the plugin. If the user is accessing your site via a proxy the 'Forwarded-for' header
will be used, allowing users from AOL to benefit from this plugin.

The fallback system looks at the visitor's language preference. If it is in the form 'en-GB' it will
use the appropriate currency for GB which is Pound Sterling. If the language preference
is in the form 'en' it will check the timezone offset of the user and guess the 
appropriate country from that, i.e. in the case of 'en' the following data will be
used:

0 - 24->

gb gb gb gb gb in in ch au au au au nz nz us us us us us us gb gb gb gb 

Under the fallback system, because the currency is determined by the settings on 
the user's machine, a visitor who happens to be in a foreign country still gets 
their own currency not the local one (unless they have changed their timezone settings).

== Screenshots ==

1. The LocalMoney settings page.
2. LocalMoney in action -- exciting isn't it!

== Changelog ==
= 1.0.5 2013-10-14 =
* Fixed a bug that prevented currency updates in some circumstances.
* Removed rounding in initial content parse to increase overall accuracy of conversion.
* Converter now removes any blocks of three digits prefixed by a '.' or ',' to remove all thousands separators.
* Added facility for converter to handle currencies where a decimal comma is used.

= 1.0.4 2013-09-12 =
* Ensured compatibility with WordPress 3.6.1 and updated documentation accordingly.

= 1.0.3 2013-06-21 =
* Changed all occurrences of '__DIR__' with 'dirname(__FILE__)' in order to be backward-compatible 
with PHP installations prior to 5.3.

= 1.0.2 2013-05-26 =
* Fixed a bug that prevented the javascript conversion from working if the WordPress 
installation was not in the domain root.

= 1.0.1 2013-04-28 =
* Corrected miscellaneous bugs

= 1.0.0 2013-03-17 =
* Base currency selector added to admin page.
* Code added to handle non-US Dollar currencies as base.
* New fancy banner designed for WordPress hosting page.
* GPL_V2 now included as part of plugin
* Various miscellaneous revisions to the readme.txt

= 0.0 2013-03-06 =
Development version!

== Upgrade Notice ==
= 1.0.5 2013-10-14 =
Bug fixes and performance improvements.

= 1.0.4 2013-09-12 =
Compatibility with WordPress 3.6.1.

= 1.0.3 2013-06-21 =
Backward compatibility bug fix.

= 1.0.2 2013-05-26 =
If your WordPress installation isn't in root you need this bug fix!

= 1.0.1 2013-04-28 =
Miscellaneous bug fix release.

= 1.0.0 2013-03-17 =
Now converts from any currency to any other!

= 0.0 2013-03-06 =
First development version.

