<?php
/**
 * @package Catpow
 * @version 1.0
 */
/*
Plugin Name: Catpow-slick
Description: Slickのブロックを追加
Author: synchro_vision
Version: 1.1
Author URI: https://twitter.com/synchro_vision
Text Domain: catpow
Domain Path: /languages
*/
add_filter('catpow_extensions',function($extensions){$extensions[]='catpow-slick';return $extensions;});

add_action('init',function(){
	wp_register_style('jqury_slick-style','https://cdn.jsdelivr.net/jquery.slick/1.6.0/slick.css');
	wp_register_style('jqury_slick-theme-style','https://cdn.jsdelivr.net/jquery.slick/1.6.0/slick-theme.css',['jqury_slick-style']);
	wp_register_script('jqury_slick','https://cdn.jsdelivr.net/jquery.slick/1.6.0/slick.min.js',['jquery'],false,true);
});