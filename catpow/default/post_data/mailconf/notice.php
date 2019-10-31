<?php
$post_data['post_title']='【お問い合わせ】[output name]様より';
$post_data['meta']=[
	'to'=>get_option('admin_email'),
	'from'=>get_option('admin_email'),
];
ob_start();
foreach($conf_data['meta']['mail']['meta'] as $name=>$conf){
	echo "[output {$name}]\n";
}
$post_data['post_content']=ob_get_clean(); ?>