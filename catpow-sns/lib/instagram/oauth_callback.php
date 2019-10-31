<?php
mb_internal_encoding("UTF-8");
include(dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))).'/wp-load.php');
global $cp_data_stock;
$state=$_GET['state'];
if($cp_data_stock->has($state)){_cp_loop_shift(['cp_data_stock_name'=>$state]);}else{exit;}
$options = array('http' => array(
	'method' => 'POST',
	'content' => http_build_query([
		'client_id' => get_option('cp_instagram_app_id'),
		'client_secret' => get_option('cp_instagram_app_secret'),
		'grant_type' => 'authorization_code',
		'redirect_uri' => home_url().'/wp-content/plugins/catpow/lib/instagram/oauth_callback.php',
		'code' => $_GET['code'],
	])
));
$json = json_decode(file_get_contents('https://api.instagram.com/oauth/access_token', false, stream_context_create($options)));
include(dirname(__FILE__).'/action/'.cp_stock_get('action').'.php');
?>