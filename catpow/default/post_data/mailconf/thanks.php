<?php
$post_data['post_title']='お問い合わせありがとうございます。';
$post_data['meta']=[
	'to'=>'[output email]',
	'from'=>get_option('admin_email'),
];
ob_start();
?>
お問い合わせありがとうございます。
<?php $post_data['post_content']=ob_get_clean(); ?>