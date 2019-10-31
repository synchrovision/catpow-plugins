<?php
/**
 * @package Catpow
 * @version 1.0
 */
/*
Plugin Name: Catpow-sns
Description: Slickのブロックを追加
Author: synchro_vision
Version: 1.1
Author URI: https://twitter.com/synchro_vision
Text Domain: catpow
Domain Path: /languages
*/
add_filter('catpow_extensions',function($extensions){$extensions[]='catpow-sns';return $extensions;});