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
 * This javascript file does all the client-side tasks of fetching the locally-cached
 * currency rates, establishing the visitor's nationality and substituting the page
 * prices for converted prices.
 */

/*
 * Change this variable if you don't keep WordPress at the root level of your domsin.
 */

var pluginpath = '/wp-content/plugins/localmoney/'; // Overriden on activation

/*
 * Set up an array mapping 2-letter country codes against currency codes and symbols.
 */

var lang5 = new Array();

lang5['ae']	= ['AED','د.إ*','.'];	//	United Arab Emirarates
lang5['af']	= ['AFN','Afs*','.'];	//	Afghanistan
lang5['al']	= ['ALL','Lek*',','];	//	Albania
lang5['am']	= ['AMD','Դ*',','];		//	Armenian Dram
lang5['an']	= ['ANG','NAƒ*','.'];	//	Netherlands Antillean Guilder
lang5['ao']	= ['AOA','Kz*','.'];	//	Angolan Kwanza
lang5['ar']	= ['ARS','$*',','];		//	Argentine Peso
lang5['au']	= ['AUD','A$*','.'];	//	Australian Dollar
lang5['aw']	= ['AWG','Afl.*','.'];	//	Aruban Florin
lang5['az']	= ['AZN','m*',','];		//	Azerbaijani Manat
lang5['ba']	= ['BAM','KM*',','];	//	Bosnia-Herzegovina Convertible Mark
lang5['bb']	= ['BBD','Bds$*','.'];	//	Barbadian Dollar
lang5['bd']	= ['BDT','৳*','.'];		//	Bangladeshi Taka
lang5['bg']	= ['BGN','лв*',','];	//	Bulgarian Lev
lang5['bh']	= ['BHD','BD*','.'];	//	Bahraini Dinar
lang5['bi']	= ['BIF','FBu*','.'];	//	Burundian Franc
lang5['bm']	= ['BMD','BD*','.'];	//	Bermudan Dollar
lang5['bn']	= ['BND','B$*','.'];	//	Brunei Dollar
lang5['bo']	= ['BOB','Bs.*',','];	//	Bolivian Boliviano
lang5['br']	= ['BRL','R$*',','];	//	Brazilian Real
lang5['bs']	= ['BSD','B$*','.'];	//	Bahamian Dollar
lang5['bt']	= ['BTN','Nu.*','.'];	//	Bhutanese Ngultrum
lang5['bw']	= ['BWP','P*','.'];		//	Botswanan Pula
lang5['by']	= ['BYR','Br*',','];	//	Belarusian Ruble
lang5['bz']	= ['BZD','BZ$*','.'];	//	Belize Dollar
lang5['ca']	= ['CAD','C$*','.'];	//	Canadian Dollar
lang5['cd']	= ['CDF','FC*','.'];	//	Congolese Franc
lang5['ch']	= ['CHF','CHF*','.'];	//	Swiss Franc
lang5['cl']	= ['CLP','$*',''];		//	Chilean Peso
lang5['cn']	= ['CNY','￥*','.'];		//	Chinese Yuan
lang5['co']	= ['COP','$*',','];		//	Colombian Peso
lang5['cr']	= ['CRC','₡*',','];		//	Costa Rican Colón
lang5['cu']	= ['CUP','$MN*',','];	//	Cuban Peso
lang5['cv']	= ['CVE','$*','.'];		//	Cape Verdean Escudo
lang5['cz']	= ['CZK','Kč*',','];	//	Czech Republic Koruna
lang5['dj']	= ['DJF','Fdj*','.'];	//	Djiboutian Franc
lang5['dk']	= ['DKK','kr.*',','];	//	Danish Krone
lang5['do']	= ['DOP','RD$*','.'];	//	Dominican Peso
lang5['dz']	= ['DZD','DA*','.'];	//	Algerian Dinar
lang5['ee']	= ['EUR','€*',','];		//	Estonian Kroon
lang5['eg']	= ['EGP','E£*','.'];	//	Egyptian Pound
lang5['et']	= ['ETB','Br*','.'];	//	Ethiopian Birr
lang5['de']	= ['EUR','€*',','];		//	Euro
lang5['dk']	= ['EUR','€*',','];		//	Euro
lang5['es']	= ['EUR','€*',','];		//	Euro
lang5['ir']	= ['EUR','€*',','];		//	Euro
lang5['be']	= ['EUR','€*',','];		//	Euro
lang5['fr']	= ['EUR','€*',','];		//	Euro
lang5['it']	= ['EUR','€*',','];		//	Euro
lang5['nl']	= ['EUR','€*',','];		//	Euro
lang5['pt']	= ['EUR','€*',','];		//	Euro
lang5['fj']	= ['FJD','FJ$*','.'];	//	Fijian Dollar
lang5['fk']	= ['FKP','£*','.'];		//	Falkland Islands Pound
lang5['gb']	= ['GBP','£*','.'];		//	British Pound Sterling
lang5['ge']	= ['GEL','* ლარი',','];//	Georgian Lari
lang5['gh']	= ['GHS','GH₵*','.'];	//	Ghanaian Cedi
lang5['gi']	= ['GIP','£*','.'];		//	Gibraltar Pound
lang5['gm']	= ['GMD','D*','.'];		//	Gambian Dalasi
lang5['gn']	= ['GNF','FG*','.'];	//	Guinean Franc
lang5['gt']	= ['GTQ','Q*','.'];		//	Guatemalan Quetzal
lang5['gy']	= ['GYD','G$*','.'];	//	Guyanaese Dollar
lang5['hk']	= ['HKD','HK$*','.'];	//	Hong Kong Dollar
lang5['hn']	= ['HNL','L*','.'];		//	Honduran Lempira
lang5['hr']	= ['HRK','kn*','.'];	//	Croatian Kuna
lang5['ht']	= ['HTG','G*','.'];		//	Haitian Gourde
lang5['hu']	= ['HUF','Ft*',','];	//	Hungarian Forint
lang5['id']	= ['IDR','Rp*',','];	//	Indonesian Rupiah
lang5['il']	= ['ILS','₪*','.'];		//	Israeli New Sheqel
lang5['in']	= ['INR','₹*','.'];		//	Indian Rupee
lang5['iq']	= ['IQD','ع.د*','.'];	//	Iraqi Dinar
lang5['ir']	= ['IRR','﷼*','.'];		//	Iranian Rial
lang5['is']	= ['ISK','kr*',','];	//	Icelandic Króna
lang5['je']	= ['JEP','£*','.'];		//	Jersey Pound
lang5['jm']	= ['JMD','J$*','.'];	//	Jamaican Dollar
lang5['jo']	= ['JOD','دينار*','.'];	//	Jordanian Dinar
lang5['jp']	= ['JPY','¥*','.'];		//	Japanese Yen
lang5['ke']	= ['KES','KSh*','.'];	//	Kenyan Shilling
lang5['kg']	= ['KGS','* som',','];	//	Kyrgystani Som
lang5['kh']	= ['KHR','៛*','.'];		//	Cambodian Riel
lang5['km']	= ['KMF','CF*','.'];	//	Comorian Franc
lang5['kp']	= ['KPW','₩*','.'];		//	North Korean Won
lang5['kr']	= ['KRW','₩*','.'];		//	South Korean Won
lang5['kw']	= ['KWD','K.D.*','.'];	//	Kuwaiti Dinar
lang5['ky']	= ['KYD','CI$*','.'];	//	Cayman Islands Dollar
lang5['kz']	= ['KZT','T*',','];		//	Kazakhstani Tenge
lang5['la']	= ['LAK','₭*','.'];		//	Laotian Kip
lang5['lb']	= ['LBP','L£*','.'];	//	Lebanese Pound
lang5['lk']	= ['LKR','Rs*','.'];	//	Sri Lankan Rupee
lang5['lr']	= ['LRD','L$*','.'];	//	Liberian Dollar
lang5['ls']	= ['LSL','M*','.'];		//	Lesotho Loti
lang5['lt']	= ['LTL','Lt*',','];	//	Lithuanian Litas
lang5['lv']	= ['LVL','Ls*',','];	//	Latvian Lats
lang5['ly']	= ['LYD','LD*','.'];	//	Libyan Dinar
lang5['ma']	= ['MAD','دراهم*',','];	//	Moroccan Dirham
lang5['md']	= ['MDL','* Leu','.'];	//	Moldovan Leu
lang5['mg']	= ['MGA','Ar*','.'];	//	Malagasy Ariary
lang5['mk']	= ['MKD','* ден',','];	//	Macedonian Denar
lang5['mm']	= ['MMK','K*','.'];		//	Myanma Kyat
lang5['mn']	= ['MNT','₮*',','];		//	Mongolian Tugrik
lang5['mo']	= ['MOP','MOP$*',','];	//	Macanese Pataca
lang5['mr']	= ['MRO','UM*','.'];	//	Mauritanian Ouguiya
lang5['mu']	= ['MUR','₨*','.'];		//	Mauritian Rupee
lang5['mv']	= ['MVR','Rf*','.'];	//	Maldivian Rufiyaa
lang5['mw']	= ['MWK','MK*','.'];	//	Malawian Kwacha
lang5['mx']	= ['MXN','$*','.'];		//	Mexican Peso
lang5['my']	= ['MYR','RM*','.'];	//	Malaysian Ringgit
lang5['mz']	= ['MZN','MT*','.'];	//	Mozambican Metical
lang5['na']	= ['NAD','N$*','.'];	//	Namibian Dollar
lang5['ng']	= ['NGN','₦*','.'];		//	Nigerian Naira
lang5['ni']	= ['NIO','C$*','.'];	//	Nicaraguan Córdoba
lang5['no']	= ['NOK','kr*',','];	//	Norwegian Krone
lang5['np']	= ['NPR','Rs*','.'];	//	Nepalese Rupee
lang5['nz']	= ['NZD','NZ$*','.'];	//	New Zealand Dollar
lang5['om']	= ['OMR','ر.ع*','.'];	//	Omani Rial
lang5['pa']	= ['PAB','B/.*','.'];	//	Panamanian Balboa
lang5['pe']	= ['PEN','S/.*','.'];	//	Peruvian Nuevo Sol
lang5['pg']	= ['PGK','K*','.'];		//	Papua New Guinean Kina
lang5['ph']	= ['PHP','₱*','.'];		//	Philippine Peso
lang5['pk']	= ['PKR','R$*','.'];	//	Pakistani Rupee
lang5['pl']	= ['PLN','zł*',','];	//	Polish Zloty
lang5['py']	= ['PYG','₲*',','];		//	Paraguayan Guarani
lang5['qa']	= ['QAR','QR*','.'];	//	Qatari Rial
lang5['ro']	= ['RON','* Leu',','];	//	Romanian Leu
lang5['rs']	= ['RSD','РСД*','.'];	//	Serbian Dinar
lang5['ru']	= ['RUB','руб.*',','];	//	Russian Ruble
lang5['rw']	= ['RWF','RF*','.'];	//	Rwandan Franc
lang5['sa']	= ['SAR','SR*','.'];	//	Saudi Riyal
lang5['sb']	= ['SBD','SI$*','.'];	//	Solomon Islands Dollar
lang5['sc']	= ['SCR','SR*','.'];	//	Seychellois Rupee
lang5['sd']	= ['SDG','S£*','.'];	//	Sudanese Pound
lang5['se']	= ['SEK','kr*',','];	//	Swedish Krona
lang5['sg']	= ['SGD','S$*','.'];	//	Singapore Dollar
lang5['sh']	= ['SHP','£*','.'];		//	Saint Helena Pound
lang5['sl']	= ['SLL','Le*','.'];	//	Sierra Leonean Leone
lang5['so']	= ['SOS','Sh.So.*','.'];//	Somali Shilling
lang5['sr']	= ['SRD','$*','.'];		//	Surinamese Dollar
lang5['st']	= ['STD','Db*','.'];	//	São Tomé and Príncipe Dobra
lang5['sv']	= ['SVC','₡*','.'];		//	Salvadoran Colón
lang5['sy']	= ['SYP','£S*','.'];	//	Syrian Pound
lang5['sz']	= ['SZL','L*','.'];		//	Swazi Lilangeni
lang5['th']	= ['THB','฿*','.'];		//	Thai Baht
lang5['tj']	= ['TJS','c*','.'];		//	Tajikistani Somoni
lang5['tm']	= ['TMT','m*','.'];		//	Turkmenistani Manat
lang5['tn']	= ['TND','DT*',','];	//	Tunisian Dinar
lang5['to']	= ['TOP','T$ *','.'];	//	Tongan Paʻanga
lang5['tr']	= ['TRY','TL*',','];	//	Turkish Lira
lang5['tt']	= ['TTD','$*','.'];		//	Trinidad and Tobago Dollar
lang5['tw']	= ['TWD','$*','.'];		//	New Taiwan Dollar
lang5['tz']	= ['TZS','*/=','.'];	//	Tanzanian Shillingsx
lang5['ua']	= ['UAH','₴*','.'];		//	Ukrainian Hryvnia
lang5['ug']	= ['UGX','USh*','.'];	//	Ugandan Shilling
lang5['us']	= ['USD','$*','.'];		//	United States Dollar
lang5['uy']	= ['UYU','$U*','.'];	//	Uruguayan Peso
lang5['uz']	= ['UZS','* som','.'];	//	Uzbekistan Som
lang5['ve']	= ['VEF','Bs.F. *','.'];//	Venezuelan Bolívar
lang5['vn']	= ['VND','*₫','.'];		//	Vietnamese Dong
lang5['vu']	= ['VUV','VT*','.'];	//	Vanuatu Vatu
lang5['ws']	= ['WST','WS$*','.'];	//	Samoan Tala
lang5['xa']	= ['XAF','FCFA *','.'];	//	CFA Franc BEAC
lang5['xc']	= ['XCD','$*','.'];		//	East Caribbean Dollar
lang5['xo']	= ['XOF','CFA*','.'];	//	CFA Franc BCEAO
lang5['xp']	= ['XPF','F*','.'];		//	CFP Franc
lang5['ye']	= ['YER','* rials','.'];//	Yemeni Rial
lang5['za']	= ['ZAR','R*','.'];		//	South African Rand
lang5['zm']	= ['ZMK','ZK*','.'];	//	Zambian Kwacha

var country = null;
var curr = null;
var source = null;
var ipFileLocation   = pluginpath + 'ip2c/livedata.php';	// the ip2c lookup folder path
var rateFileLocation = pluginpath + 'get_local_rates.php';	// the currency rates lookup folder path

/*
 * Use jQuery to look up country from IP address from my own web service returns
 * the two character coutry code or null in the variable 'country'.
 */

jQuery.ajax({
	url: ipFileLocation
})
.done(function(json) {

	country = json['id2'].toLowerCase();
	if (!country.length==2) {
		country = null;

		/*
		 * Set up an array mapping language code coutry extensions against timezone offsets
		 */

		// Timezone offsets	0		1		2		3		4		5		6		7		8		9		10		11		12		13		14		15		16		17		18		19		20		21		22		23	

		lang2tz = new Array();

		lang2tz['en'] = [	'gb',	'gb',	'gb',	'gb',	'gb',	'in',	'in',	'ch',	'au',	'au',	'au',	'au',	'nz',	'nz',	'us',	'us',	'us',	'us',	'us',	'us',	'gb',	'gb',	'gb',	'gb'	];
		lang2tz['es'] = [	'es',	'es',	'es',	'es',	'es',	'es',	'es',	'es',	'es',	'es',	'es',	'es',	'es',	'es',	'us',	'us',	'us',	'us',	'co',	'bo',	'ar',	'es',	'es',	'es'	];
		lang2tz['fr'] = [	'fr',	'fr',	'fr',	'fr',	'fr',	'fr',	'fr',	'fr',	'fr',	'fr',	'fr',	'fr',	'fr',	'fr',	'ca',	'ca',	'ca',	'ca',	'ca',	'ca',	'fr',	'fr',	'fr',	'fr'	];
		lang2tz['pt'] = [	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'pt',	'br',	'br',	'br',	'br'	];	

		/*
		 * Set up 5-letter language code. If only 2-letter is available use timezone offset
		 * to guess the 5-letter code. If no timezone info available use the default value.
		 */

		lang = (navigator.language) ? navigator.language : navigator.userLanguage;
		lang = lang.toLowerCase();
		co = lang.indexOf('-');
		if (co > -1) country = lang.substr(co+1,9);
		d = new Date();
		tz = Math.floor(d.getTimezoneOffset()/60);
		rate = null;
		source = 'timezone';

		if (lang2tz[lang] != null) {
			country = lang2tz[lang][tz];
		} else if (lang.length == 2) {
			country = lang;
		}

		convert(country,source);

	} else {
		source = 'IP2C';
		convert(country,source);
	}
})
.fail(function(jqXHR, textStatus, errorThrown) {
})

function convert (thiscountry,thesource) {
	curr = lang5[thiscountry][0];
	symbol = lang5[thiscountry][1];


	/*
	 * Use jQuery.ajax to get the latest exchange rates, via JSON and convert all the
	 * prices on the page.
	 */

	jQuery.ajax({
		url: rateFileLocation
	})
	.done(function(json) {
		rate = json['rates'][curr];

		/*
		 * Convert all prices in the page
		 */

		jQuery('.currency').each(function(){
			from = jQuery(this).html();
			from = from.replace(/[^\d.]/,'');
			to = from*rate;
			/*
			 * Round the price to two decimal places if a marker present for this currency
			 */
			if (lang5[thiscountry][2] != '') {
				to = Math.floor(to*100+0.5)/100+'';
			}
			/*
			 * Set the decimal character to the correct one for this currency
			 */
			to = to.replace('.',lang5[thiscountry][2]);
			/*
			 * Place the new figure in the page
			 */
			jQuery(this).html(symbol.replace('*',to));
		})
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
	});
}
