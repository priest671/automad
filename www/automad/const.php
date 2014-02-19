<?php defined('AUTOMAD') or die('Direct access not permitted!');
/*
 *	                  ....
 *	                .:   '':.
 *	                ::::     ':..
 *	                ::.         ''..
 *	     .:'.. ..':.:::'    . :.   '':.
 *	    :.   ''     ''     '. ::::.. ..:
 *	    ::::.        ..':.. .''':::::  .
 *	    :::::::..    '..::::  :. ::::  :
 *	    ::'':::::::.    ':::.'':.::::  :
 *	    :..   ''::::::....':     ''::  :
 *	    :::::.    ':::::   :     .. '' .
 *	 .''::::::::... ':::.''   ..''  :.''''.
 *	 :..:::'':::::  :::::...:''        :..:
 *	 ::::::. '::::  ::::::::  ..::        .
 *	 ::::::::.::::  ::::::::  :'':.::   .''
 *	 ::: '::::::::.' '':::::  :.' '':  :
 *	 :::   :::::::::..' ::::  ::...'   .
 *	 :::  .::::::::::   ::::  ::::  .:'
 *	  '::'  '':::::::   ::::  : ::  :
 *	            '::::   ::::  :''  .:
 *	             ::::   ::::    ..''
 *	             :::: ..:::: .:''
 *	               ''''  '''''
 *	
 *
 *	AUTOMAD CMS
 *
 *	Copyright (c) 2013 by Marc Anton Dahmen
 *	http://marcdahmen.de
 *
 *	Licensed under the MIT license.
 */


// Base URL for all URLs relative to the root
if (strpos($_SERVER['SCRIPT_NAME'], '/automad/gui') !== false) {
	// For all GUI pages, '/automad/gui/*' will be removed
	define('AM_BASE_URL', substr($_SERVER['SCRIPT_NAME'], 0, strpos($_SERVER['SCRIPT_NAME'], '/automad/gui')));
} else {
	// For index.php (normal pages) and automad/index.php
	define('AM_BASE_URL', str_replace(array('/automad/index.php', '/index.php'), '', $_SERVER['SCRIPT_NAME']));
}


// Pretty URLs
if (file_exists(AM_BASE_DIR . '/.htaccess')) {
	// If .htaccess exists, assume that pretty URLs are enabled and AM_INDEX is empty
	define('AM_INDEX', '');
} else {
	// If not, AM_INDEX will be defined
	define('AM_INDEX', '/index.php');
}


// DEBUG
if (!defined('AM_DEBUG_ENABLED')) {
	define('AM_DEBUG_ENABLED', false);
}
if (!defined('AM_DEBUG_CONSOLE')) {
	define('AM_DEBUG_CONSOLE', false);
}


// DIR
// Pages
if (!defined('AM_DIR_PAGES')) {
	define('AM_DIR_PAGES', '/pages');
}
// Shared
if (!defined('AM_DIR_SHARED')) {
	define('AM_DIR_SHARED', '/shared');
}
// Themes
if (!defined('AM_DIR_THEMES')) {
	define('AM_DIR_THEMES', '/themes');
}
// Cache
if (!defined('AM_DIR_CACHE')) {
	define('AM_DIR_CACHE', '/cache');
}
// Page Cache
if (!defined('AM_DIR_CACHE_PAGES')) {
	define('AM_DIR_CACHE_PAGES', AM_DIR_CACHE . '/pages');
}
// Image Cache
if (!defined('AM_DIR_CACHE_IMAGES')) {
	define('AM_DIR_CACHE_IMAGES', AM_DIR_CACHE . '/images');
}
// Trash
if (!defined('AM_DIR_TRASH')) {
	define('AM_DIR_TRASH', AM_DIR_CACHE . '/trash');
}
// Default template directory
if (!defined('AM_DIR_DEFAULT_TEMPLATES')) {
	define('AM_DIR_DEFAULT_TEMPLATES', '/automad/templates');
}


// FILE
// Data file extension
if (!defined('AM_FILE_EXT_DATA')) {
	// Changing that constant will also require updating the .htaccess file!
	// (for blocking direct access)
	define('AM_FILE_EXT_DATA', 'txt');
}
// Cache file prefix
if (!defined('AM_FILE_PREFIX_CACHE')) {
	// Changing that constant will also require updating the .htaccess file!
	// (for blocking direct access)
	define('AM_FILE_PREFIX_CACHE', 'cached');
}
// Cache file extension
if (!defined('AM_FILE_EXT_PAGE_CACHE')) {
	define('AM_FILE_EXT_PAGE_CACHE', 'html');
}
// Sidewide settings/variable
if (!defined('AM_FILE_SITE_SETTINGS')) {
	define('AM_FILE_SITE_SETTINGS', AM_BASE_DIR . AM_DIR_SHARED . '/site.' . AM_FILE_EXT_DATA); 
}
// Site modification time
if (!defined('AM_FILE_SITE_MTIME')) {
	define('AM_FILE_SITE_MTIME', AM_BASE_DIR . AM_DIR_CACHE . '/' . AM_FILE_PREFIX_CACHE . '_site_mtime');
}
// Site object cache
if (!defined('AM_FILE_SITE_OBJECT_CACHE')) {
	define('AM_FILE_SITE_OBJECT_CACHE', AM_BASE_DIR . AM_DIR_CACHE . '/' . AM_FILE_PREFIX_CACHE . '_site_object');
}
// Default template
if (!defined('AM_FILE_DEFAULT_TEMPLATE')) {
	define('AM_FILE_DEFAULT_TEMPLATE', AM_BASE_DIR . AM_DIR_DEFAULT_TEMPLATES . '/default.php');
}
// User accounts file
define('AM_FILE_ACCOUNTS', AM_BASE_DIR . '/config/accounts.txt');
// List of file extensions to identify a file in an URL and to list files in the GUI
if (!defined('AM_ALLOWED_FILE_TYPES')) {
	define('AM_ALLOWED_FILE_TYPES', serialize(array('css', 'jpg', 'zip', 'png', 'svg', 'js', 'pdf', 'mp3', 'gif')));
}


// PAGE
// Title for 404 page
if (!defined('AM_PAGE_ERROR_TITLE')) {
	define('AM_PAGE_ERROR_TITLE', '404');
}
// Title for search results page
if (!defined('AM_PAGE_RESULTS_TITLE')) {
	define('AM_PAGE_RESULTS_TITLE', 'Search Results');
}
// URL of search results page
if (!defined('AM_PAGE_RESULTS_URL')) {
	define('AM_PAGE_RESULTS_URL', '/results');
}


// CACHE
// Enable cache
if (!defined('AM_CACHE_ENABLED')) {
	define('AM_CACHE_ENABLED', true);
}
// Site modification time check delay (seconds)
if (!defined('AM_CACHE_MONITOR_DELAY')) {
	define('AM_CACHE_MONITOR_DELAY', 60);
}


// IMAGE
// Default jpg quality
if (!defined('AM_IMG_JPG_QUALITY')) {
	define('AM_IMG_JPG_QUALITY', 90);
}


// LISTING DEFAULTS
// Default sort direction
if (!defined('AM_LIST_DEFAULT_SORT_DIR')) {
	define('AM_LIST_DEFAULT_SORT_DIR', 'desc');
}


// TEMPLATE DELIMITERS
// Left delimiter for includes
if (!defined('AM_TMPLT_DEL_INC_L')) {
	define('AM_TMPLT_DEL_INC_L', 'i(');
}
// Right delimiter for includes
if (!defined('AM_TMPLT_DEL_INC_R')) {
	define('AM_TMPLT_DEL_INC_R', ')');
}
// Left delimiter for page variables
if (!defined('AM_TMPLT_DEL_PAGE_VAR_L')) {
	define('AM_TMPLT_DEL_PAGE_VAR_L', 'p(');
}
// Right delimiter for page variables
if (!defined('AM_TMPLT_DEL_PAGE_VAR_R')) {
	define('AM_TMPLT_DEL_PAGE_VAR_R', ')');
}
// Left delimiter for site variables
if (!defined('AM_TMPLT_DEL_SITE_VAR_L')) {
	define('AM_TMPLT_DEL_SITE_VAR_L', 's(');
}
// Right delimiter for site variables
if (!defined('AM_TMPLT_DEL_SITE_VAR_R')) {
	define('AM_TMPLT_DEL_SITE_VAR_R', ')');
}
// Left delimiter for toolbox functions
if (!defined('AM_TMPLT_DEL_TOOL_L')) {
	define('AM_TMPLT_DEL_TOOL_L', 't(');
}
// Right delimiter for toolbox functions
if (!defined('AM_TMPLT_DEL_TOOL_R')) {
	define('AM_TMPLT_DEL_TOOL_R', ')');
}
// Left delimiter for extensions
if (!defined('AM_TMPLT_DEL_XTNSN_L')) {
	define('AM_TMPLT_DEL_XTNSN_L', 'x(');
}
// Right delimiter for extensions
if (!defined('AM_TMPLT_DEL_XTNSN_R')) {
	define('AM_TMPLT_DEL_XTNSN_R', ')');
}


// EXTENDER
// Extensions namespace
if (!defined('AM_NAMESPACE_EXTENSIONS')) {
	define('AM_NAMESPACE_EXTENSIONS', '\\Extensions');
}


// HTML
// Navigation class
if (!defined('AM_HTML_CLASS_NAV')) {
	define('AM_HTML_CLASS_NAV', 'nav');
}
// Previous page link class
if (!defined('AM_HTML_CLASS_PREV')) {
	define('AM_HTML_CLASS_PREV', 'prev');
}
// Next page link class
if (!defined('AM_HTML_CLASS_NEXT')) {
	define('AM_HTML_CLASS_NEXT', 'next');
}
// Filter menu class
if (!defined('AM_HTML_CLASS_FILTER')) {
	define('AM_HTML_CLASS_FILTER', 'filter');
}
// Navigation tree class
if (!defined('AM_HTML_CLASS_TREE')) {
	define('AM_HTML_CLASS_TREE', 'tree');
}
// Page list class
if (!defined('AM_HTML_CLASS_LIST')) {
	define('AM_HTML_CLASS_LIST', 'list');
}
// Page image set class
if (!defined('AM_HTML_CLASS_IMAGESET')) {
	define('AM_HTML_CLASS_IMAGESET', 'imageset');
}
// Sort menu class
if (!defined('AM_HTML_CLASS_SORT')) {
	define('AM_HTML_CLASS_SORT', 'sort');
}
// Class for link to Home page in navigation 
if (!defined('AM_HTML_CLASS_HOME')) {
	define('AM_HTML_CLASS_HOME', 'home');
}
// Class for current page in navigation
if (!defined('AM_HTML_CLASS_CURRENT')) {
	define('AM_HTML_CLASS_CURRENT', 'current');
}
// Class for a page within the path of the current page in the navigation
if (!defined('AM_HTML_CLASS_CURRENT_PATH')) {
	define('AM_HTML_CLASS_CURRENT_PATH', 'currentPath');
}
// Breadcrumbs class
if (!defined('AM_HTML_CLASS_BREADCRUMBS')) {
	define('AM_HTML_CLASS_BREADCRUMBS', 'breadcrumbs');
}
// Search form class
if (!defined('AM_HTML_CLASS_SEARCH')) {
	define('AM_HTML_CLASS_SEARCH', 'search');
}
// Breadcrumbs items separator
if (!defined('AM_HTML_STR_BREADCRUMB_SEPARATOR')) {
	define('AM_HTML_STR_BREADCRUMB_SEPARATOR', '<span class="separator"> &gt; </span>');
}
// Filter menu text for "all items"
if (!defined('AM_HTML_TEXT_FILTER_ALL')) {
	define('AM_HTML_TEXT_FILTER_ALL', 'All');
}
// Max characters in list output
if (!defined('AM_HTML_LIST_MAX_CHARS')) {
	define('AM_HTML_LIST_MAX_CHARS', 150);
}


// PARSE
// Block separator - separates all key/value pairs
// Must be used as the only string in a line within the template files.
if (!defined('AM_PARSE_BLOCK_SEPARATOR')) {
	define('AM_PARSE_BLOCK_SEPARATOR', '-');
}
// Pair separator - separates the key from the value
if (!defined('AM_PARSE_PAIR_SEPARATOR')) {
	define('AM_PARSE_PAIR_SEPARATOR', ':');
}
// Tags separator
if (!defined('AM_PARSE_STR_SEPARATOR')) {
	define('AM_PARSE_STR_SEPARATOR', ',');
}


// KEYS
// Hidden key (to identify the visibility status of a page in its txt file)
if (!defined('AM_KEY_HIDDEN')) {
	define('AM_KEY_HIDDEN', 'hidden');
}
// Tags key (to identify tags in the page's txt file)
if (!defined('AM_KEY_TAGS')) {
	define('AM_KEY_TAGS', 'tags');
}
// Theme key (to identify a theme in the page's txt file)
if (!defined('AM_KEY_THEME')) {
	define('AM_KEY_THEME', 'theme');
}
// Title key (to identify a title in the page's txt file)
if (!defined('AM_KEY_TITLE')) {
	define('AM_KEY_TITLE', 'title');
}
// Sitename key (to identify the sitename in the site's txt file)
if (!defined('AM_KEY_SITENAME')) {
	define('AM_KEY_SITENAME', 'sitename');
}
// URL key (to identify an URL in the page's txt file)
if (!defined('AM_KEY_URL')) {
	define('AM_KEY_URL', 'url');
}


// Version number 
include(AM_BASE_DIR . '/automad/version.php');


// License key
$keyFile = AM_BASE_DIR . '/config/licensekey.txt';
if (file_exists($keyFile)) {
	$key = preg_replace('/[^A-Za-z0-9_\-]/', '', trim(file_get_contents($keyFile)));
	define('AM_LIC_KEY', $key);
} else {
	define('AM_LIC_KEY', '');
}

 
?>
