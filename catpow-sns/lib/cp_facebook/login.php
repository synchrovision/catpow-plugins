<?php
include(dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))).'/wp-load.php');
include('../Facebook/autoload.php');
$fb=new Facebook\Facebook([
	'app_id'=>get_option('cp_facebook_app_id'),
	'app_secret'=>get_option('cp_facebook_app_secret'),
	'default_graph_version' => 'v2.4',
]);
$helper = $fb->getRedirectLoginHelper();

try {
	$accessToken = $helper->getAccessToken();
} catch(Facebook\Exceptions\FacebookResponseException $e) {
	echo 'Graph returned an error: '.$e->getMessage();
} catch(Facebook\Exceptions\FacebookSDKException $e) {
	echo 'Facebook SDK returned an error: '.$e->getMessage();
}

if (isset($accessToken)) {
	set_transient('cpfb_access_token',(string)$accessToken);
	$user_data=$fb->get('/me?fields=email,name,picture',$access_token)->getDecodedBody();
	$fid=$user_data['id'];
	$q=new WP_User_Query(array('meta_query'=>array(
		'key'=>'_facebook_id',
		'value'=>$fid
	)));
	if($q->get_total==0){
		$uid=wp_insert_user([
			'user_pass'=>wp_generate_password(),
			'user_login'=>$user_data['name'],
			'user_email'=>$user_data['email'],
			'first_name'=>$user_data['first_name'],
			'last_name'=>$user_data['last_name']
		]);
		add_user_meta($uid,'_facebook_id',$fid,true);
	}else{
		$users=$q->get_results();
		$uid=reset($users)->ID;
	}
	wp_set_auth_cookeis($uid);
}
?>
<script type="text/javascript">
	window.close();
</script>