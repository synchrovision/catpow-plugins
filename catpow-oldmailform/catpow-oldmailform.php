<?php
/**
 * @package Catpow
 * @version 1.0
 */
/*
Plugin Name: Catpow-OldMailForm
Description: Catpow/meta/mailクラスを、設定をcpdbに保存する旧式に置き換える
Author: synchro_vision
Version: 1.1
Author URI: https://twitter.com/synchro_vision
Text Domain: catpow
Domain Path: /languages
*/
add_filter('catpow_extensions',function($extensions){$extensions[]='catpow-oldmailform';return $extensions;});
